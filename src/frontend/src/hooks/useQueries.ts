import type { Principal } from "@icp-sdk/core/principal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useActor } from "./useActor";

export function useAccountInfo() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["accountInfo"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getAccountInfo();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useTransactions() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["transactions"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getTransactions();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useRequests() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["requests"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getRequests();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useContacts() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["contacts"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllContacts();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUserProfile() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["userProfile"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSendMoney() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      to,
      amount,
      description,
      contactName,
    }: {
      to: Principal;
      amount: bigint;
      description: string;
      contactName: string | null;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.sendMoney(to, amount, description, contactName);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accountInfo"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
  });
}

export function useRequestMoney() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      to,
      amount,
      description,
      contactName,
    }: {
      to: Principal;
      amount: bigint;
      description: string;
      contactName: string | null;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.requestMoney(to, amount, description, contactName);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["requests"] });
    },
  });
}

export function useSaveProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (name: string) => {
      if (!actor) throw new Error("Not connected");
      return actor.saveCallerUserProfile({ name });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
    },
  });
}

export function useAddContact() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      name,
      contactPrincipal,
    }: {
      name: string;
      contactPrincipal: Principal;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.addContact(name, contactPrincipal);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
    },
  });
}

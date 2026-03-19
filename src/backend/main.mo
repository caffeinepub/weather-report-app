import Map "mo:core/Map";
import Text "mo:core/Text";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Iter "mo:core/Iter";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

// run migration on Upgrade
actor {
  public type Contact = {
    name : Text;
    contactPrincipal : Principal;
  };

  public type Transaction = {
    transactionId : Text;
    from : Principal;
    to : Principal;
    contactName : ?Text; // Optional contact name for convenience
    amount : Nat;
    timestamp : Int;
    description : Text;
    transactionType : { #sent; #received; #requestSent; #requestReceived };
    status : { #pending; #completed; #cancelled };
  };

  public type Request = {
    requestId : Text;
    from : Principal;
    to : Principal;
    amount : Nat;
    timestamp : Int;
    description : Text;
    status : { #pending; #completed; #rejected };
    contactName : ?Text; // Optional contact name for convenience
  };

  public type AccountInfo = {
    principal : Principal;
    balance : Nat;
    maskedAccountNumber : Text;
  };

  public type WalletUser = {
    principal : Principal;
    balance : Nat;
    maskedAccountNumber : Text;
    contacts : Map.Map<Text, Contact>;
    transactions : Map.Map<Text, Transaction>;
    requests : Map.Map<Text, Request>;
  };

  public type UserProfile = {
    name : Text;
  };

  // Initialize the user system state
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  let users = Map.empty<Principal, WalletUser>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  func getCallerUserOpt(caller : Principal) : ?WalletUser {
    users.get(caller);
  };

  // User Profile Management (required by frontend)
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Wallet Public Methods
  public query ({ caller }) func getAccountInfo() : async AccountInfo {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view account info");
    };
    let user = switch (getCallerUserOpt(caller)) {
      case (null) {
        Runtime.trap("Caller Not Found in Map");
      };
      case (?user) { user };
    };

    {
      principal = user.principal;
      balance = user.balance;
      maskedAccountNumber = user.maskedAccountNumber;
    };
  };

  public query ({ caller }) func getContact(name : Text) : async ?Contact {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view contacts");
    };
    let user = switch (getCallerUserOpt(caller)) {
      case (null) {
        Runtime.trap("Caller Not Found in Map");
      };
      case (?user) { user };
    };
    user.contacts.get(name);
  };

  public query ({ caller }) func getAllContacts() : async [Contact] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view contacts");
    };
    let user = switch (getCallerUserOpt(caller)) {
      case (null) {
        Runtime.trap("Caller Not Found in Map");
      };
      case (?user) { user };
    };

    user.contacts.values().toArray();
  };

  public query ({ caller }) func getTransactions() : async [Transaction] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view transactions");
    };
    let user = switch (getCallerUserOpt(caller)) {
      case (null) {
        Runtime.trap("Caller Not Found in Map");
      };
      case (?user) { user };
    };

    user.transactions.values().toArray();
  };

  public query ({ caller }) func getRequests() : async [Request] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view requests");
    };
    let user = switch (getCallerUserOpt(caller)) {
      case (null) {
        Runtime.trap("Caller Not Found in Map");
      };
      case (?user) { user };
    };

    user.requests.values().toArray();
  };

  public shared ({ caller }) func sendMoney(to : Principal, amount : Nat, description : Text, contactName : ?Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can send money");
    };

    let sender = switch (getCallerUserOpt(caller)) {
      case (null) {
        Runtime.trap("Sender Not Found");
      };
      case (?user) { user };
    };

    if (amount > sender.balance) {
      Runtime.trap("Insufficient balance");
    };

    let receiver = switch (getCallerUserOpt(to)) {
      case (null) {
        Runtime.trap("Receiver Not Found");
      };
      case (?user) { user };
    };

    let newTransactionId = description.concat(caller.toText());
    let senderTransaction : Transaction = {
      transactionId = newTransactionId;
      from = caller;
      to;
      contactName;
      amount;
      timestamp = 0; // Add your timestamp logic here
      description;
      transactionType = #sent;
      status = #completed;
    };

    let receiverTransaction : Transaction = {
      transactionId = newTransactionId;
      from = caller;
      to;
      contactName;
      amount;
      timestamp = 0; // Add your timestamp logic here
      description;
      transactionType = #received;
      status = #completed;
    };

    // Update sender
    let updatedSender = {
      sender with
      balance = sender.balance - amount;
    };
    updatedSender.transactions.add(newTransactionId, senderTransaction);
    users.add(caller, updatedSender);

    // Update receiver
    let updatedReceiver = {
      receiver with
      balance = receiver.balance + amount;
    };
    updatedReceiver.transactions.add(newTransactionId, receiverTransaction);
    users.add(to, updatedReceiver);
  };

  public shared ({ caller }) func requestMoney(to : Principal, amount : Nat, description : Text, contactName : ?Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can request money");
    };

    let requester = switch (getCallerUserOpt(caller)) {
      case (null) {
        Runtime.trap("Requester Not Found");
      };
      case (?user) { user };
    };

    let recipient = switch (getCallerUserOpt(to)) {
      case (null) {
        Runtime.trap("Recipient Not Found");
      };
      case (?user) { user };
    };

    let newRequestId = description.concat(caller.toText());
    let newRequest : Request = {
      requestId = newRequestId;
      from = caller;
      to;
      amount;
      timestamp = 0; // Add your timestamp logic here
      description;
      status = #pending;
      contactName;
    };

    // Add request to requester's list (as sent)
    requester.requests.add(newRequestId, newRequest);
    users.add(caller, requester);

    // Add request to recipient's list (as received)
    recipient.requests.add(newRequestId, newRequest);
    users.add(to, recipient);
  };

  public shared ({ caller }) func addContact(name : Text, contactPrincipal : Principal) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add contacts");
    };

    let user = switch (getCallerUserOpt(caller)) {
      case (null) {
        Runtime.trap("User Not Found");
      };
      case (?user) { user };
    };

    let newContact = {
      name;
      contactPrincipal;
    };

    user.contacts.add(name, newContact);
    users.add(caller, user);
  };

  public query ({ caller }) func getContactByPrincipal(principal : Principal) : async ?Contact {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can search contacts");
    };

    // Only allow users to search their own contacts
    let user = switch (getCallerUserOpt(caller)) {
      case (null) {
        Runtime.trap("User Not Found");
      };
      case (?user) { user };
    };

    let contact = user.contacts.values().find(
      func(c) {
        c.contactPrincipal == principal;
      }
    );
    contact;
  };
};

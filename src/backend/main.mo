import Map "mo:core/Map";
import List "mo:core/List";
import Iter "mo:core/Iter";
import Order "mo:core/Order";
import Time "mo:core/Time";
import Text "mo:core/Text";
import Runtime "mo:core/Runtime";
import Array "mo:core/Array";
import Principal "mo:core/Principal";
import Storage "blob-storage/Storage";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";
import MixinStorage "blob-storage/Mixin";

actor {
  include MixinStorage();

  public type ClassType = {
    #six;
    #seven;
  };

  module ClassType {
    public func compare(class1 : ClassType, class2 : ClassType) : Order.Order {
      switch (class1, class2) {
        case (#six, #seven) { #less };
        case (#seven, #six) { #greater };
        case (_, _) { #equal };
      };
    };
  };

  public type Subject = {
    #maths;
    #science;
  };

  module Subject {
    public func compare(subject1 : Subject, subject2 : Subject) : Order.Order {
      switch (subject1, subject2) {
        case (#maths, #science) { #less };
        case (#science, #maths) { #greater };
        case (_, _) { #equal };
      };
    };
  };

  public type Role = {
    #management;
    #student;
  };

  public type Content = {
    live : Text;
    recorded : [Text];
    notes : Text;
    questions : [Question];
  };

  public type Question = {
    question : Text;
    options : [Text];
    correctAnswerIndex : Nat;
  };

  public type ChatMessage = {
    senderName : Text;
    role : Text;
    text : Text;
    timestamp : Time.Time;
  };

  public type Submission = {
    studentName : Text;
    classType : ClassType;
    subject : Subject;
    score : Nat;
  };

  type ClassContentKey = (ClassType, Subject);
  module ClassContentKey {
    public func compare(key1 : ClassContentKey, key2 : ClassContentKey) : Order.Order {
      switch (ClassType.compare(key1.0, key2.0)) {
        case (#equal) {
          Subject.compare(key1.1, key2.1);
        };
        case (order) { order };
      };
    };
  };

  let submissions = List.empty<Submission>();
  let chatMessages = Map.empty<ClassContentKey, List.List<ChatMessage>>();
  let classContent = Map.empty<ClassContentKey, Content>();
  var googlePayQrBlob : ?Storage.ExternalBlob = null;

  func createClassContent(
    classType : ClassType,
    subject : Subject,
    live : Text,
    recorded : [Text],
    notes : Text,
    questions : [Question],
  ) : Content {
    {
      live;
      recorded;
      notes;
      questions;
    };
  };

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Management-only content endpoints
  public shared ({ caller }) func updateClassContent(classType : ClassType, subject : Subject, live : Text, recorded : [Text], notes : Text, questions : [Question]) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only management can update classType content");
    };

    let newContent = createClassContent(classType, subject, live, recorded, notes, questions);
    classContent.add((classType, subject), newContent);
  };

  public shared ({ caller }) func updateGooglePayQrBlob(blob : Storage.ExternalBlob) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only management can update Google Pay QR blob");
    };
    googlePayQrBlob := ?blob;
  };

  // Student and public endpoints
  public query ({ caller }) func getClassContent(classType : ClassType, subject : Subject) : async Content {
    switch (classContent.get((classType, subject))) {
      case (null) { Runtime.trap("Content not found for specified classType and subject") };
      case (?content) { content };
    };
  };

  public query ({ caller }) func getGooglePayQrBlob() : async ?Storage.ExternalBlob {
    googlePayQrBlob;
  };

  // Chat endpoints
  public shared ({ caller }) func addChatMessage(classType : ClassType, subject : Subject, senderName : Text, role : Text, text : Text) : async () {
    let message : ChatMessage = {
      senderName;
      role;
      text;
      timestamp = Time.now();
    };

    let key = (classType, subject);

    switch (chatMessages.get(key)) {
      case (null) {
        let messages = List.empty<ChatMessage>();
        messages.add(message);
        chatMessages.add(key, messages);
      };
      case (?existingMessages) {
        existingMessages.add(message);
      };
    };
  };

  public query ({ caller }) func getChatMessages(classType : ClassType, subject : Subject) : async [ChatMessage] {
    switch (chatMessages.get((classType, subject))) {
      case (null) { [] };
      case (?messages) { messages.toArray() };
    };
  };

  public shared ({ caller }) func submitTest(studentName : Text, classType : ClassType, subject : Subject, score : Nat) : async () {
    let submission = {
      studentName;
      classType;
      subject;
      score;
    };
    submissions.add(submission);
  };

  public query ({ caller }) func getTestSubmission(studentName : Text, classType : ClassType, subject : Subject) : async ?Submission {
    submissions.values().find(
      func(submission) {
        submission.studentName == studentName and submission.classType == classType and submission.subject == subject
      }
    );
  };
};

“What does the system do?” → **Use Case**

“What is the system made of?” → **UML**

“How is the data stored?” → **ERD(entity relationship diagram)**

“How is the system built?” → **Architecture**



**Each type of diagram** provides a different perspective on the system: the Use Case diagram describes user interactions with the application, the UML Class Diagram defines the internal structure of the system, the ERD presents the database model, and the Architecture Diagram highlights the system’s layered organization and the technologies used.





**The ERD illustrates** the database structure of the Gym Membership Management System. It includes the main entities of the application and their relationships. One-to-many relationships are used for subscriptions, payments, and attendance records, while the many-to-many relationship between members and trainers is implemented through the MemberTrainer junction table.



**The UML diagram** : This diagram shows the main parts of our system and how they are connected.
We added a UserAccount class to handle login and roles, like Admin, Receptionist, Trainer, and Member. Depending on the role, a user can be linked to a Member or a Trainer, but not necessarily to both.
(Pentru fiecare UserAccount:poate exista 0 Member (ex: Admin, Receptionist) sau 1 Member; DAR:fiecare Member ARE EXACT 1 UserAccount)
The main functionality is around Members, Trainers, Subscriptions, Payments, and Attendance. A member can have multiple subscriptions, payments, and attendance records, which is why we use one-to-many relationships.
The connection between Members and Trainers is many-to-many, so we used an extra class called MemberTrainer to manage that.
We didn’t use inheritance because each class has a different role in the system and they don’t really extend each other.



**The Use Case Diagram** illustrates the main interactions between the administrator and the Gym Membership Management System. The administrator can manage members, subscriptions, payments, trainers, attendance, and reports through the system.



**The Architecture Diagram** illustrates the layered structure of the Gym Membership Management System. The presentation layer is implemented using Angular, the business logic layer is developed in C#/.NET, the data access layer uses Entity Framework Core and the Repository Pattern, and persistent data is stored in a SQL database. This structure ensures modularity, maintainability, and separation of responsibilities.


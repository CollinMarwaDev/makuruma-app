// app/data/sample-users.ts
export type User = {
    email: string;
    id: string;
    lastLogin: string;
    name: string;
    role: string;
    status: "active" | "inactive";
};

export const users: User[] = [
    {
        email: "john.doe@example.com",
        id: "1",
        lastLogin: "2023-09-15T14:30:00Z",
        name: "John Doe",
        role: "Admin",
        status: "active",
    },
    {
        email: "jane.smith@example.com",
        id: "2",
        lastLogin: "2023-09-18T09:45:00Z",
        name: "Jane Smith",
        role: "Editor",
        status: "active",
    },
    {
        email: "robert.j@example.com",
        id: "3",
        lastLogin: "2023-08-30T11:20:00Z",
        name: "Robert Johnson",
        role: "Viewer",
        status: "inactive",
    },
    {
        email: "emily.davis@example.com",
        id: "4",
        lastLogin: "2023-09-17T16:15:00Z",
        name: "Emily Davis",
        role: "Editor",
        status: "active",
    },
    {
        email: "michael.w@example.com",
        id: "5",
        lastLogin: "2023-09-19T08:30:00Z",
        name: "Michael Wilson",
        role: "Admin",
        status: "active",
    },
    {
        email: "sarah.b@example.com",
        id: "6",
        lastLogin: "2023-09-14T13:45:00Z",
        name: "Sarah Brown",
        role: "Viewer",
        status: "active",
    },
    {
        email: "david.m@example.com",
        id: "7",
        lastLogin: "2023-09-01T10:20:00Z",
        name: "David Miller",
        role: "Editor",
        status: "inactive",
    },
    {
        email: "lisa.a@example.com",
        id: "8",
        lastLogin: "2023-09-16T15:10:00Z",
        name: "Lisa Anderson",
        role: "Viewer",
        status: "active",
    },
    {
        email: "james.t@example.com",
        id: "9",
        lastLogin: "2023-09-18T11:05:00Z",
        name: "James Taylor",
        role: "Admin",
        status: "active",
    },
    {
        email: "patricia.m@example.com",
        id: "10",
        lastLogin: "2023-09-15T09:30:00Z",
        name: "Patricia Moore",
        role: "Editor",
        status: "active",
    },
    {
        email: "thomas.w@example.com",
        id: "11",
        lastLogin: "2023-08-25T14:50:00Z",
        name: "Thomas White",
        role: "Viewer",
        status: "inactive",
    },
    {
        email: "jennifer.c@example.com",
        id: "12",
        lastLogin: "2023-09-19T10:40:00Z",
        name: "Jennifer Clark",
        role: "Editor",
        status: "active",
    },
];

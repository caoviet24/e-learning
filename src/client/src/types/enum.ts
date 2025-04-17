
export enum Role {
    STUDENT = "STUDENT",
    LECTURER = "LECTURER",
    ADMIN = "ADMIN"
}

export enum Action {
    CREATE = "CREATE",
    READ = "READ",
    UPDATE = "UPDATE",
    DELETE = "DELETE",
    DELETE_SOFT = "DELETE_SOFT",
    RESTORE = "RESTORE"
}

export enum LecturerStatus {
    WORKING = "WORKING",
    TEMPORARILYABSENT = "TEMPORARILYABSENT",
    RESIGNED = "RESIGNED",
}

export enum StudentStatus 
{
    STUDYING = "STUDYING",
    DEFERRED = "DEFERRED",
    GRADUATED = "GRADUATED",
    DROPPEDOUT = "DROPPEDOUT"
}


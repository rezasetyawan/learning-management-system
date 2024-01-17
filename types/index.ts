export type Module = {
    id: string;
    name: string;
    order: number;
    type: "LESSON" | "QUIZZ" | "SUBMISSION";
    content: string;
    isPublished: boolean;
    // isDeleted: boolean;
    // deletedAt: string;
};

export type ModuleGroup = {
    id: string;
    name: string;
    order: number;
    modules: Module[];
    isPublished: boolean;
    // isDeleted: boolean;
    // deletedAt: string;
};

export type Academy = {
    id: string;
    name: string;
    createdAt: string;
    updatedAt: string;
    description: string;
    moduleGroups: ModuleGroup[];
    coverImageUrl: string;
    isPublished: boolean;
};

export type createModuleGroup = {
    name: string;
    createdAt: string;
    updatedAt: string;
    academyId: string;
    isPublished: boolean;
    order: number;
}

export type createModule = {
    name: string;
    createdAt: string;
    updatedAt: string;
    academyId: string;
    isPublished: boolean;
    order: number;
    // using default value ("LESSON") from the database 
    // type:"LESSON" | "QUIZZ" | "SUBMISSION"
    academyModuleGroupId: string
}
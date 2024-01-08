type Module = {
    id: string;
    name: string;
    order: number;
    type: "LESSON" | "QUIZZ" | "SUBMISSION";
    content: string;
    isPublished: boolean;
};

type ModuleGroup = {
    id: string;
    name: string;
    order: number;
    modules: Module[];
    isPublished: boolean;
};
type Academy = {
    id: string;
    name: string;
    createdAt: string;
    updatedAt: string;
    description: string;
    moduleGroups: ModuleGroup[];
    coverImageUrl: string;
    isPublished: boolean;
};
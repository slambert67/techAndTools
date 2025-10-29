(() => {

    type OnlyStrings<T> = {
        [K in keyof T as T[K] extends string ? K : never]: T[K];  // 
    };

    interface Example {
        id: number;
        name: string;
        active: boolean;
        role: string;
    }

    type Result = OnlyStrings<Example>; 
    // should be { name: string; role: string; }
})();   


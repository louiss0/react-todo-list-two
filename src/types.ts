class Task {

    public readonly id:string ;
    constructor(
        public text: string,
        public completed= false,
    ) {
        

        this.id = Math.random().toString(32);
    }
}

type Tasks = Array<Task>


export type {Tasks }

export {Task }
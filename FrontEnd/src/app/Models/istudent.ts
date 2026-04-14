export interface IstudentGrade {
    Crs_Id: number;
    Crs_Name: string;
    Grade: number | null;
}

export interface Istudent {
    St_Id: number;
    St_Fname: string;
    St_Lname: string;
    St_Address?: string;
    St_Age?: number;
    Dept_Id?: number;
    Dept_Name?: string;
    Grades?: IstudentGrade[];
}

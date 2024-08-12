export interface ISystemGoalOperatingModelKpiProps {
  description: string;
  title: string;
  system_goal: string;
  goal: string;
  sub_goal: string;
  kpi: string;
  division: string;
  hospital: string;
  metrix: string;
  getGoalMetrix: IGoalMetrix[];
  getDivision: IHospital[];
  getHospital: IHospital[];
  getKPI: IKPI[];
  getSubGoal: ISubGoal[];
  getGoal: IGoal[];
  getSystemGoal: ISystemGoal[];
  getOperatingModel: IOperatingModel[];
  getAllHospital: IHospital[];
}

export interface ISystemGoalOperatingModelProps {
  description: string;
  title: string;
  getOperatingModel:IOperatingModel[];
  getGoalMetrix: IGoalMetrix[];
  getDivision : IHospital[]
  getHospital: IHospital[];
  getKPI: IKPI[];
  getSubGoal: ISubGoal[];
  getGoal: IGoal[];
  getSystemGoal: ISystemGoal[];
  getAllHospital: IHospital[];
}

export interface IDivision{
  Id: number;
  Title: string;
  OrganizationId: string;
  Organization : ISystemGoal
}

export interface IGoalMetrix{
  OperatingModelId: number;
  OrganizationId: number;
  GoalId: number;
  SubGoalId: number;
  KPIId: number;
  HospitalId: number;
  DivisionId: number;
  Actual: string;
  Target: string;
  URL: string;
  ActualVerified: boolean;
  ActualVerify: boolean | true;
  TargerVerified: boolean;
  Comment: string;

}

export interface IHospital{
  Id: number;
  Title: string;
  Division: IDivision;
  DivisionId: number;
  OrganizationId: number;
  Organization: string;
  Division1: string;
  Division1Id: number;
}

export interface IGoal{
  Id: number;
  Title: string;
}
export interface IKPI{
  Id: number;
  Title: string;
  SubGoalId: number;
  SubGoal: string;
  GoalId: number;
}
export interface ISubGoal{
  Id: number;
  Title: string;
  Goal: string;
  GoalId: number;

}
export interface ISystemGoal{
  [x: string]: any;
  Id: number;
  Title: string;
}

export interface IOperatingModel{
  Id: number;
  Title: string;
}
import * as React from "react";
import styles from "./SystemGoalOperatingModel.module.scss";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "bootstrap/dist/css/bootstrap.min.css";

import "bootstrap/dist/js/bootstrap.min.js";

import type {
  // IDivision,
  IGoal,
  IGoalMetrix,
  IHospital,
  IKPI,
  ISubGoal,
  ISystemGoal,
  ISystemGoalKpiProps,
  ISystemGoalProps,
  IOperatingModel,
} from "./ISystemGoalOperatingModelProps";
//import { useState } from "react";
// import { useState } from "react";
// import * as React from "react";

export interface ISystemGoalKpiWpState {
  title: string;
  dataOperatingModel: IOperatingModel[] | null;
  dataGoalMetrix: IGoalMetrix[] | null;
  dataDivision: IHospital[] | null;
  dataHospital: IHospital[] | null;
  dataKPI: IKPI[] | null;
  dataSubGoal: ISubGoal[] | null;
  dataGoal: IGoal[] | null;
  dataSystemGoal: ISystemGoal[] | null;
  selectedHospitals: Set<number>;
  dataAllHospital: IHospital[] | null;
  checkedSystemGoals: { [key: string]: boolean }; // Track checkbox state
}

export default class SystemGoalKpi extends React.Component<
  ISystemGoalProps,
  ISystemGoalKpiWpState
> {
  [x: string]: any;
  state: {
    title: string; dataAllHospital: IHospital[]; dataOperatingModel: IOperatingModel[]; dataGoalMetrix: IGoalMetrix[]; // Initialize state with the passed prop or null
    dataDivision: IHospital[]; // Initialize state with the passed prop or null
    dataHospital: IHospital[]; // Initialize state with the passed prop or null
    dataKPI: IKPI[]; // Initialize state with the passed prop or null
    dataSubGoal: ISubGoal[]; // Initialize state with the passed prop or null
    dataGoal: IGoal[]; // Initialize state with the passed prop or null
    dataSystemGoal: ISystemGoal[]; // Initialize state with the passed prop or null
    selectedHospitals: Set<any>; checkedSystemGoals: { People: boolean; QualityandExperience: boolean; FinanceandOperations: boolean; Strategy: boolean; };
  };
  props: any;
  public constructor(props: ISystemGoalKpiProps) {
    super(props);
    this.state = {
      title: props.title,
      dataAllHospital: props.getAllHospital || null,
      dataOperatingModel: props.getOperatingModel || null,
      dataGoalMetrix: props.getGoalMetrix || null, // Initialize state with the passed prop or null
      dataDivision: props.getDivision || null, // Initialize state with the passed prop or null
      dataHospital: props.getHospital || null, // Initialize state with the passed prop or null
      dataKPI: props.getKPI || null, // Initialize state with the passed prop or null
      dataSubGoal: props.getSubGoal || null, // Initialize state with the passed prop or null
      dataGoal: props.getGoal || null, // Initialize state with the passed prop or null
      dataSystemGoal: props.getSystemGoal || null, // Initialize state with the passed prop or null
      selectedHospitals: new Set(),
      checkedSystemGoals: {
        People: true,
        QualityandExperience: true,
        FinanceandOperations: true,
        Strategy: true,
      },
    };
    console.log("tsx file constructor");
  }

  private handleHospitalCheckboxChange = (hospitalId: number) => {
    this.setState((prevState) => {
      const selectedHospitals = new Set(prevState.selectedHospitals);
      console.log("selectedHospitals", selectedHospitals);
      if (selectedHospitals.has(hospitalId)) {
        selectedHospitals.delete(hospitalId);
      } else {
        selectedHospitals.add(hospitalId);
        console.log("selectedHospitals", selectedHospitals);
      }
      return { selectedHospitals };
    });
  };

  // Get Main System Goal
  private getSystemGoalTitle = (organizationId: number) => {
    const { dataSystemGoal } = this.state;
    if (!dataSystemGoal) return "Unknown System Goal"; // Check if dataSystemGoal is null
    const systemGoal = dataSystemGoal.find(
      (systemGoal: { Id: number; }) => systemGoal.Id === organizationId
    );
    return systemGoal ? systemGoal.Title : "Unknown System Goal";
  };


  // Get KPI
  private getOperatingModel = (Id: number) => {
    const { dataOperatingModel } = this.state;
    if (!dataOperatingModel) return "Unknown KPI"; // Check if dataKPI is null
    const OperatingModel = dataOperatingModel.find(
      (OperatingModel: { Id: number; }) => OperatingModel.Id === Id
    );
    return OperatingModel ? OperatingModel.Title : "Unknown Operating Model";
  };
  // get Division
  private getDivisionTitle = (divisionId: number) => {
    const { dataDivision } = this.state;
    if (!dataDivision) return "Unknown Division"; // Check if dataHospital is null
    const division = dataDivision.find(
      (division: { Id: number; }) => division.Id === divisionId
    );
    return division ? division.Title : "Unknown Hospital";
  };

  // get Hospital
  //dataAllHospital;
  private getHospitalTitle = (hospitalId: number) => {
    const { dataAllHospital } = this.state;
    if (!dataAllHospital) return "Unknown Hospital"; // Check if dataHospital is null
    const hospital = dataAllHospital.find(
      (hospital: { Id: number; }) => hospital.Id === hospitalId
    );
    return hospital ? hospital.Title : "Unknown Hospital";
  };

  // private getHospitalTitle = (hospitalId: number) => {
  //   const { dataHospital } = this.state;
  //   if (!dataHospital) return "Unknown Hospital"; // Check if dataHospital is null
  //   const hospital = dataHospital.find(
  //     (hospital) => hospital.Id === hospitalId
  //   );
  //   return hospital ? hospital.Title : "Unknown Hospital";
  // };

  // Group data by OperatingModel
  private groupOperatingModel = (data: IOperatingModel[]) => {
    const groupOperatingModel: any = {};

    data.forEach((item) => {
      if (!groupOperatingModel[item.Id]) {
        groupOperatingModel[item.Id] = {};
      }
      // groupOperatingModel[item.Id].push(item);
    });

    return groupOperatingModel;
  };

  private handleDivisionCheckboxChange = (
    divisionId: number,
    organizationId: number
  ) => {
    this.setState((prevState) => {
      const selectedHospitals = new Set(prevState.selectedHospitals);
      const divisionHospitals = Object.keys(
        prevState.dataHospital || {}
      ).filter((hospitalId) =>
        prevState.dataHospital?.find(
          (hospital: { Id: number; DivisionId: number; OrganizationId: number; }) =>
            hospital.Id === Number(hospitalId) &&
            hospital.DivisionId === divisionId &&
            hospital.OrganizationId === organizationId
        )
      );

      if (
        divisionHospitals.every((hospitalId) =>
          selectedHospitals.has(Number(hospitalId))
        )
      ) {
        // If all hospitals in this division are already selected, deselect them
        divisionHospitals.forEach((hospitalId) =>
          selectedHospitals.delete(Number(hospitalId))
        );
      } else {
        // Otherwise, select all hospitals in this division
        divisionHospitals.forEach((hospitalId) =>
          selectedHospitals.add(Number(hospitalId))
        );
      }

      return { selectedHospitals };
    });
  };

  // Group data by divisionId, then HospitalId
  private groupDivisionData = (data: IHospital[]) => {
    const groupDivisionData: any = {};

    data.forEach((item) => {
      if (!groupDivisionData[item.OrganizationId]) {
        groupDivisionData[item.OrganizationId] = {};
      }
      if (!groupDivisionData[item.OrganizationId][item.DivisionId]) {
        groupDivisionData[item.OrganizationId][item.DivisionId] = {};
      }
      if (!groupDivisionData[item.OrganizationId][item.DivisionId][item.Id]) {
        groupDivisionData[item.OrganizationId][item.DivisionId][item.Id] = [];
      }
      groupDivisionData[item.OrganizationId][item.DivisionId][item.Id].push(
        item
      );
    });

    return groupDivisionData;
  };

  private handleSystemGoalCheckboxChange = (goal: string) => {
    this.setState((prevState: { checkedSystemGoals: { [x: string]: any; }; }) => ({
      checkedSystemGoals: {
        ...prevState.checkedSystemGoals,
        [goal]: !prevState.checkedSystemGoals[goal],
      },
    }));
  };

  // Group data by organizationId, then GoalId, then SubGoalId, and finally by KPIId
  private groupData = (data: IGoalMetrix[]) => {
    const groupedData: any = {};

    data.forEach((item) => {
      if (!groupedData[item.OrganizationId]) {
        groupedData[item.OrganizationId] = {};
      }
      if (!groupedData[item.OrganizationId][item.GoalId]) {
        groupedData[item.OrganizationId][item.GoalId] = {};
      }
      if (!groupedData[item.OrganizationId][item.GoalId][item.SubGoalId]) {
        groupedData[item.OrganizationId][item.GoalId][item.SubGoalId] = {};
      }
      if (
        !groupedData[item.OrganizationId][item.GoalId][item.SubGoalId][
          item.KPIId
        ]
      ) {
        groupedData[item.OrganizationId][item.GoalId][item.SubGoalId][
          item.KPIId
        ] = [];
      }
      groupedData[item.OrganizationId][item.GoalId][item.SubGoalId][
        item.KPIId
      ].push(item);
    });

    return groupedData;
  };

  public render(): React.ReactElement<ISystemGoalKpiProps> {
    const {
      dataGoalMetrix,
      dataHospital,
      dataOperatingModel,
      checkedSystemGoals,
    } = this.state;

    // Example class names to be added
   

    const groupedOperatingModel = this.groupOperatingModel(
      dataOperatingModel || []
    );
    const groupedData = this.groupData(dataGoalMetrix || []);
    const groupedDivisionData = this.groupDivisionData(dataHospital || []);

    console.log("final groupedDivisionData dataHospital=", dataHospital);
    console.log("final groupedData=", groupedData);
    console.log("final groupedDivisionData=", groupedDivisionData);
    console.log("final Operating Model=", dataOperatingModel);
    console.log("title", this.props.title);

    // const ToggleDivs = () => {
    //   const [visibleDivs, setVisibleDivs] = useState({
    //     People: true,
    //     Quality: true,
    //     Finance: true,
    //     Strategy: true,
    //   });

    //   const handleCheckboxChange = (event: { target: { id: any; checked: any; }; }) => {
    //     const { id, checked } = event.target;
    //     setVisibleDivs((prevVisibleDivs) => ({
    //       ...prevVisibleDivs,
    //       [id]: checked,
    //     }));
    //   };

    return (
      <section>
        <div
          style={{
            width: "100%",
            fontSize: "36px",
            textAlign: "center",
            marginBottom: "32px",
          }}
        >
          {this.props.title}
        </div>

        {Object.keys(groupedOperatingModel).map((Id) => (
          <>
            <div>
              <div className="btn_container">
                <h3>
                  <span>{this.getOperatingModel(Number(Id))} </span>
                </h3>
                <div>
                  {Object.keys(groupedDivisionData).map((organizationId) => (
                    <>
                      <div className="with_goal_filter">
                        <div className="cat action primary">
                          <label>
                            <input type="checkbox" value="1" />
                            <span>
                              {this.getSystemGoalTitle(Number(organizationId))}{" "}
                            </span>
                          </label>
                        </div>
                        <div className="dropdown">
                          <button
                            className="btn dropdown-toggle"
                            type="button"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                          >
                            <i className="fas fa-filter"></i>
                            <span
                              style={{
                                flex: "1",
                                textAlign: "left",
                                position: "relative",
                                top: "-1px",
                              }}
                            >
                              {" "}
                              System Goal
                            </span>
                          </button>
                          <ul className="dropdown-menu">
                            <li>
                              <input
                                type="checkbox"
                                name="People"
                                className="form-check-input"
                                id="People"
                                checked={checkedSystemGoals["People"]}
                                onChange={() =>
                                  this.handleSystemGoalCheckboxChange("People")
                                }
                              />
                              <label className="dropdown-item" htmlFor="People">
                                People
                              </label>
                            </li>
                            <li>
                              <input
                                type="checkbox"
                                name="QualityandExperience"
                                className="form-check-input"
                                id="QualityandExperience"
                                checked={checkedSystemGoals["People"]}
                                onChange={() =>
                                  this.handleSystemGoalCheckboxChange(
                                    "QualityandExperience"
                                  )
                                }
                              />
                              <label
                                htmlFor="QualityandExperience"
                                className="dropdown-item"
                              >
                                Quality and Experience
                              </label>
                            </li>
                            <li>
                              <input
                                type="checkbox"
                                className="form-check-input"
                                id="FinanceandOperations"
                                checked={
                                  checkedSystemGoals["FinanceandOperations"]
                                }
                                onChange={() =>
                                  this.handleSystemGoalCheckboxChange(
                                    "FinanceandOperations"
                                  )
                                }
                              />
                              <label
                                htmlFor="FinanceandOperations"
                                className="dropdown-item"
                              >
                                Finance and Operations
                              </label>
                            </li>
                            <li>
                              <input
                                type="checkbox"
                                className="form-check-input"
                                id="Strategy"
                                checked={checkedSystemGoals["Strategy"]}
                                onChange={() =>
                                  this.handleSystemGoalCheckboxChange(
                                    "Strategy"
                                  )
                                }
                              />
                              <label
                                htmlFor="Strategy"
                                className="dropdown-item"
                              >
                                Strategy
                              </label>
                            </li>
                          </ul>
                        </div>
                      </div>

                      <div className="multi_btn_group">
                        {Object.keys(groupedDivisionData[organizationId]).map(
                          (divisionId) => (
                            <div className="inner_btn_group">
                              <div
                                key={divisionId}
                                className="cat action secondary"
                              >
                                <label>
                                  <input
                                    type="checkbox"
                                    value={divisionId}
                                    onChange={() =>
                                      this.handleDivisionCheckboxChange(
                                        Number(divisionId),
                                        Number(organizationId)
                                      )
                                    }
                                    checked={Object.keys(
                                      groupedDivisionData[organizationId][
                                        divisionId
                                      ]
                                    ).every((hospitalId) =>
                                      this.state.selectedHospitals.has(
                                        Number(hospitalId)
                                      )
                                    )}
                                  />
                                  <span>
                                    {this.getDivisionTitle(Number(divisionId))}
                                  </span>
                                </label>
                              </div>

                              <div className="btn_group">
                                {Object.keys(
                                  groupedDivisionData[organizationId][
                                    divisionId
                                  ]
                                ).map((hospitalId) => (
                                  <div className="cat action">
                                    <label key={hospitalId}>
                                      <input
                                        type="checkbox"
                                        value={hospitalId}
                                        onChange={() =>
                                          this.handleHospitalCheckboxChange(
                                            Number(hospitalId)
                                          )
                                        }
                                        checked={this.state.selectedHospitals.has(
                                          Number(hospitalId)
                                        )}
                                      />
                                      <span>
                                        {this.getHospitalTitle(
                                          Number(hospitalId)
                                        )}
                                      </span>
                                    </label>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </>
                  ))}
                </div>
              </div>
              <div>
               <div className="system_goal_operating_model">
                <div className="table_title">Quality Experience</div>
                <table className="main_table">
                  <tbody>
                    {/* 1 */}
                    <tr className="single_row">
                      <th>Inpatient</th>
                      <td style={{padding: '0'}}>
                        <table className="child_table">
                          <thead>
                            <th>Measure</th>
                            <th>Baseline <br></br> (FY 23)</th>
                            <th>FYTD24</th>
                            <th>Threshold</th>
                            <th>Target</th>
                            <th>Max</th>
                            <th>Points</th>
                            <th>Comments</th>
                          </thead>
                         <tbody>
                         <tr>
                         <td>Excess Days
                            <div>YTD 24: [month-month]</div>
                          </td>
                          <td>200996</td>
                          <td>191620</td>
                          <td>190599</td>
                          <td>187530</td>
                          <td>184460</td>
                          <td className="cell_blue">0</td>
                          <td>
                            <textarea></textarea>
                          </td>
                         </tr>
                         </tbody>
                        </table>
                      </td>
                    </tr>
                    {/* 2 */}
                    <tr className="single_row">
                      <th>Ambulatory Measures</th>
                      <td style={{padding: '0'}}>
                        <table className="child_table">
                          <thead>
                            <th>Measure</th>
                            <th>Baseline <br></br> (FY 23)</th>
                            <th>FYTD24</th>
                            <th>Threshold</th>
                            <th>Target</th>
                            <th>Max</th>
                            <th>Points</th>
                            <th>Comments</th>
                          </thead>
                         <tbody>
                         <tr>
                         <td>HTN BP Control (%)
                            <div className="small_title">YTD 24: [month-month]</div>
                          </td>
                          <td>70.8</td>
                          <td>52.6</td>
                          <td>76.1</td>
                          <td>78.1</td>
                          <td>80.1</td>
                          <td className="cell_blue">0</td>
                          <td>
                            <textarea></textarea>
                          </td>
                         </tr>
                         {/* 2nd row */}
                         <tr>
                         <td>DM BP (%)
                         <div className="small_title">YTD 24: [month-month]</div>
                          </td>
                          <td>73.5</td>
                          <td>53.8</td>
                          <td>71.7</td>
                          <td>73.7</td>
                          <td>75.7</td>
                          <td className="cell_blue">0</td>
                          <td>
                            <textarea></textarea>
                          </td>
                         </tr>
                         {/* 3nd row */}
                         <tr>
                         <td>DM A1c (%)
                         <div className="small_title">YTD 24: [month-month]</div>
                          </td>
                          <td>76.8</td>
                          <td>40.7</td>
                          <td>69.1</td>
                          <td>71.1</td>
                          <td>73.1</td>
                          <td className="cell_blue">0</td>
                          <td>
                            <textarea></textarea>
                          </td>
                         </tr>
                         </tbody>
                        </table>
                      </td>
                    </tr>
                    {/* 3 */}
                    <tr className="single_row">
                      <th>Patient Experince</th>
                      <td style={{padding: '0'}}>
                        <table className="child_table">
                          <thead>
                            <th>Measure</th>
                            <th>Baseline <br></br> (FY 23)</th>
                            <th>FYTD24</th>
                            <th>Threshold</th>
                            <th>Target</th>
                            <th>Max</th>
                            <th>Points</th>
                            <th>Comments</th>
                          </thead>
                         <tbody>
                         <tr>
                         <td>Inpatient: Responsiveness (%)
                            <div className="small_title">YTD 24: [month-month]</div>
                          </td>
                          <td>59.5</td>
                          <td>57.75</td>
                          <td>59.49</td>
                          <td>59.51</td>
                          <td>62.61</td>
                          <td className="cell_blue">0</td>
                          <td>
                            <textarea></textarea>
                          </td>
                         </tr>
                         {/* 2nd row */}
                         <tr>
                         <td>Ambulatory: Visit rating (%)
                         <div className="small_title">YTD 24: [month-month]</div>
                          </td>
                          <td>87.7</td>
                          <td>88.93</td>
                          <td>87.7</td>
                          <td>87.8</td>
                          <td className="cell_green">87.9</td>
                          <td className="cell_blue">0</td>
                          <td>
                            <textarea></textarea>
                          </td>
                         </tr>
                         </tbody>
                        </table>
                      </td>
                    </tr>
                    {/* 4 */}
                    <tr className="single_row">
                      <th>Inpatient</th>
                      <td style={{padding: '0'}}>
                        <table className="child_table">
                          <thead>
                            <th>Measure</th>
                            <th>Baseline <br></br> (FY 23)</th>
                            <th>FYTD24</th>
                            <th>Threshold</th>
                            <th>Target</th>
                            <th>Max</th>
                            <th>Points</th>
                            <th>Comments</th>
                          </thead>
                         <tbody>
                         <tr>
                         <td>Readmissions (%)
                            <div className="small_title">YTD 24: [month-month]</div>
                          </td>
                          <td>10.71</td>
                          <td>10.69</td>
                          <td>10.25</td>
                          <td>10.05</td>
                          <td>9.85</td>
                          <td className="cell_blue">0</td>
                          <td>
                            <textarea></textarea>
                          </td>
                         </tr>
                         </tbody>
                        </table>
                      </td>
                    </tr>
                  </tbody>
                </table>
               </div>
              </div>
            </div>
          </>
        ))}
        <div className={styles.dummy}></div>
      </section>
    );
  }
}

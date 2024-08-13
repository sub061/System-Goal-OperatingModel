import * as React from "react";
import styles from "./SystemGoalOperatingModel.module.scss";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "bootstrap/dist/css/bootstrap.min.css";

import "bootstrap/dist/js/bootstrap.min.js";
import type {
  IGoal,
  IGoalMetrix,
  IHospital,
  IKPI,
  IOperatingModel,
  ISubGoal,
  ISystemGoal,
  ISystemGoalOperatingModelKpiProps,
  ISystemGoalOperatingModelProps,
} from "./ISystemGoalOperatingModelKpiProps";
//import { escape } from "@microsoft/sp-lodash-subset";

export interface ISystemGoalOperatingModelWpState {
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
  selectedHospitalsNew: Set<number>;
  dataAllHospital: IHospital[] | null;
  checkedSystemGoals: { [key: string]: boolean }; // Track checkbox state
  checkedSystemGoalsNew: Set<number>;
  selectedDivisions: Set<number>;
  selectedOrganizations: Set<number>; // Add this line
  // Add other properties here
  groupedDivisionData: any; // Ensure this matches your actual data type
}

export default class SystemGoalOperatingModel extends React.Component<
  ISystemGoalOperatingModelProps,
  ISystemGoalOperatingModelWpState
> {
  public constructor(props: ISystemGoalOperatingModelKpiProps) {
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
      selectedHospitalsNew: new Set([1, 2, 3, 4]),
      checkedSystemGoals: {
        People: true,
        ["Quality&Experience"]: true,
        FinanceandOperations: true,
        Strategy: true,
      },
      checkedSystemGoalsNew: new Set([1, 2, 3, 4]),
      selectedDivisions: new Set(),
      selectedOrganizations: new Set(), // Initialize this
      groupedDivisionData: {}, // Ensure this matches your actual data type
    };
    // console.log("tsx file constructor");
  }

  // Get Goal
  private getGoalTitle = (GoalId: number) => {
    const { dataGoal } = this.state;
    if (!dataGoal) return "Unknown Goal"; // Check if dataGoal is null
    const goal = dataGoal.find((goal) => goal.Id === GoalId);
    return goal ? goal.Title : "Unknown Goal";
  };

  // Get sub Goal
  private getSubGoalTitle = (SubGoalId: number) => {
    const { dataSubGoal } = this.state;
    if (!dataSubGoal) return "Unknown SubGoal"; // Check if dataSubGoal is null
    const subgoal = dataSubGoal.find((subgoal) => subgoal.Id === SubGoalId);
    return subgoal ? subgoal.Title : "Unknown SubGoal";
  };

  // get Division
  private getDivisionTitle = (divisionId: number) => {
    const { dataDivision } = this.state;
    if (!dataDivision) return "Unknown Division"; // Check if dataHospital is null
    const division = dataDivision.find(
      (division) => division.Id === divisionId
    );
    return division ? division.Title : "Unknown Hospital";
  };

  handleOrganizationCheckboxChange = (organizationId: number) => {
    const { groupedDivisionData, selectedOrganizations } = this.state;
    const isChecked = !selectedOrganizations.has(organizationId);

    this.setState((prevState) => {
      const updatedSelectedHospitals = new Set(prevState.selectedHospitals);

      // Update divisions
      Object.keys(groupedDivisionData[organizationId] || {}).forEach(
        (divisionId) => {
          const isDivisionChecked = isChecked;
          if (isDivisionChecked) {
            Object.keys(
              groupedDivisionData[organizationId][divisionId] || {}
            ).forEach((hospitalId) => {
              updatedSelectedHospitals.add(Number(hospitalId));
            });
          } else {
            Object.keys(
              groupedDivisionData[organizationId][divisionId] || {}
            ).forEach((hospitalId) => {
              updatedSelectedHospitals.delete(Number(hospitalId));
            });
          }
        }
      );

      return {
        selectedHospitals: updatedSelectedHospitals,
        selectedOrganizations: new Set(
          isChecked
            ? [...prevState.selectedOrganizations, organizationId]
            : [...prevState.selectedOrganizations].filter(
              (id) => id !== organizationId
            )
        ),
      };
    });
  };

  /***
   * New Functions
   * @author Ganesh
   *
   *
   */

  private prepareHospitalHirerachy = (data: IHospital[]) => {
    const result: any = [];

    data.forEach((hospital) => {
      // Find the organization in the result array
      let organization = result.find(
        (org: any) => org.id === hospital.OrganizationId
      );

      // If the organization doesn't exist, create it
      if (!organization) {
        organization = {
          name: "BILH", // Adjust the organization name as needed
          id: hospital.OrganizationId,
          division: [],
        };
        result.push(organization);
      }

      // Find the division in the organization's divisions array
      let division = organization.division.find(
        (div: any) => div.id === hospital.DivisionId
      );

      // If the division doesn't exist, create it
      if (!division) {
        division = {
          name: this.getDivisionTitle(hospital.DivisionId), // Adjust the division name as needed
          id: hospital.DivisionId,
          hospitals: [],
        };
        organization.division.push(division);
      }

      // Add the hospital to the division
      division.hospitals.push({
        id: hospital.Id,
        title: hospital.Title,
      });
    });

    return result;
  };

  private getGoalHirerachy = (data: IKPI[]) => {
    const result: any = [];
    data.forEach((kpi) => {
      // Find the goal in the result array
      let goal = result.find((g: any) => g.id === kpi.GoalId);

      // If the goal doesn't exist, create it
      if (!goal) {
        goal = {
          name: this.getGoalTitle(kpi.GoalId), // Adjust the goal name as needed
          id: kpi.GoalId,
          subGoal: [],
        };
        result.push(goal);
      }

      // Find the subGoal in the goal's subGoals array
      let subGoal = goal.subGoal.find((sg: any) => sg.id === kpi.SubGoalId);

      // If the subGoal doesn't exist, create it
      if (!subGoal) {
        subGoal = {
          name: this.getSubGoalTitle(kpi.SubGoalId), // Adjust the subGoal name as needed
          id: kpi.SubGoalId,
          kpi: [],
        };
        goal.subGoal.push(subGoal);
      }

      // Add the KPI to the subGoal
      subGoal.kpi.push({
        id: kpi.Id,
        title: kpi.Title,
      });
    });

    return result;
  };

  private handleHospitalChange = (hospitalId: number) => {
    this.setState((prevState) => {
      const updatedSelection = new Set(prevState.selectedHospitalsNew);
      if (updatedSelection.has(hospitalId)) {
        updatedSelection.delete(hospitalId);
      } else {
        updatedSelection.add(hospitalId);
      }
      return { selectedHospitalsNew: updatedSelection };
    });
  };

  private handleDivisionChange = (
    divisionId: number,
    hirerachicalHospitalData: any
  ) => {
    this.setState((prevState) => {
      const updatedSelection = new Set(prevState.selectedHospitalsNew);
      const hospitalsToToggle: any[] = [];

      hirerachicalHospitalData.forEach((org: any) => {
        org.division.forEach((div: any) => {
          if (div.id === divisionId) {
            div.hospitals.forEach((hospital: any) => {
              hospitalsToToggle.push(hospital.id);
            });
          }
        });
      });

      const allSelected = hospitalsToToggle.every((id) =>
        updatedSelection.has(id)
      );

      if (allSelected) {
        hospitalsToToggle.forEach((id) => updatedSelection.delete(id));
      } else {
        hospitalsToToggle.forEach((id) => updatedSelection.add(id));
      }

      return { selectedHospitalsNew: updatedSelection };
    });
  };

  private handleOrganizationChange = (
    organizationId: number,
    hirerachicalHospitalData: any
  ) => {
    this.setState((prevState) => {
      const updatedSelection = new Set(prevState.selectedHospitalsNew);
      const hospitalsToToggle: any[] = [];

      hirerachicalHospitalData.forEach((org: any) => {
        if (org.id === organizationId) {
          org.division.forEach((div: any) => {
            div.hospitals.forEach((hospital: any) => {
              hospitalsToToggle.push(hospital.id);
            });
          });
        }
      });

      const allSelected = hospitalsToToggle.every((id) =>
        updatedSelection.has(id)
      );

      if (allSelected) {
        hospitalsToToggle.forEach((id) => updatedSelection.delete(id));
      } else {
        hospitalsToToggle.forEach((id) => updatedSelection.add(id));
      }

      return { selectedHospitalsNew: updatedSelection };
    });
  };

  private handleGoalChange = (goalId: number) => {
    this.setState((prevState) => {
      const updatedSelection = new Set(prevState.checkedSystemGoalsNew);
      if (updatedSelection.has(goalId)) {
        updatedSelection.delete(goalId);
      } else {
        updatedSelection.add(goalId);
      }
      return { checkedSystemGoalsNew: updatedSelection };
    });
  };

  private findMatrixValues = (
    subGoalId: number,
    kpiId: number,
    hospitalId: number,
    matrix: any,
    key: string
  ) => {
    const a = matrix.find(
      (item: any) =>
        item.KPIId === kpiId &&
        item.HospitalId === hospitalId &&
        item.SubGoalId === subGoalId
    );
    return a ? a[key] : null;
  };

  public render(): React.ReactElement<ISystemGoalOperatingModelProps> {
    const {
      dataGoalMetrix,
      selectedHospitalsNew,
      checkedSystemGoalsNew,
      dataAllHospital,
      dataKPI,
    } = this.state;
    console.log("dataGoalMetrix", dataGoalMetrix);
    const hirerachicalHospitalData = this.prepareHospitalHirerachy(
      dataAllHospital || []
    );
    const goalHirerachyData = this.getGoalHirerachy(dataKPI || []);

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

        <div>
          <div className="btn_container">
            <h3>
              <span>System Goal 2025</span>
            </h3>
            <div>
              {hirerachicalHospitalData.map((organization: any) => (
                <>
                  <div className="with_goal_filter">
                    <div className="cat action primary">
                      <label>
                        <input
                          type="checkbox"
                          value={organization.id}
                          checked={organization.division.every((divison: any) =>
                            divison.hospitals.every((hospital: any) =>
                              selectedHospitalsNew.has(hospital.id)
                            )
                          )}
                          onChange={() =>
                            this.handleOrganizationChange(
                              organization.id,
                              hirerachicalHospitalData
                            )
                          }
                        />
                        <span>{organization.name}</span>
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
                            checked={checkedSystemGoalsNew.has(1)}
                            onChange={() => this.handleGoalChange(1)}
                          />
                          <label className="dropdown-item" htmlFor="People">
                            People
                          </label>
                        </li>
                        <li>
                          <input
                            type="checkbox"
                            name="Quality&Experience"
                            className="form-check-input"
                            id="Quality&Experience"
                            checked={checkedSystemGoalsNew.has(2)}
                            onChange={() => this.handleGoalChange(2)}
                          />
                          <label
                            htmlFor="Quality&Experience"
                            className="dropdown-item"
                          >
                            Quality & Experience
                          </label>
                        </li>
                        <li>
                          <input
                            type="checkbox"
                            className="form-check-input"
                            id="FinanceandOperations"
                            checked={checkedSystemGoalsNew.has(3)}
                            onChange={() => this.handleGoalChange(3)}
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
                            checked={checkedSystemGoalsNew.has(4)}
                            onChange={() => this.handleGoalChange(4)}
                          />
                          <label htmlFor="Strategy" className="dropdown-item">
                            Strategy
                          </label>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="multi_btn_group">
                    {hirerachicalHospitalData[0].division.map(
                      (division: any) => (
                        <div
                          className={`inner_btn_group ${division.id == null ? "d-none" : ""
                            }`}
                        >
                          <div className="cat action secondary">
                            <label>
                              <input
                                type="checkbox"
                                value={division.id}
                                checked={division.hospitals.every(
                                  (hospital: any) =>
                                    selectedHospitalsNew.has(hospital.id)
                                )}
                                onChange={() =>
                                  this.handleDivisionChange(
                                    division.id,
                                    hirerachicalHospitalData
                                  )
                                }
                              />
                              <span>
                                {division.name} {division.id}
                              </span>
                            </label>
                          </div>
                          <div className="btn_group">
                            {division.hospitals.map((hospital: any) => (
                              <div className="cat action">
                                <label key="">
                                  <input
                                    type="checkbox"
                                    value={hospital.id}
                                    checked={selectedHospitalsNew.has(
                                      hospital.id
                                    )}
                                    onChange={() =>
                                      this.handleHospitalChange(hospital.id)
                                    }
                                  />
                                  <span>
                                    {hospital.title}
                                    {hospital.id}
                                  </span>
                                </label>
                              </div>
                            ))}
                          </div>
                        </div>
                      )
                    )}
                  </div>

                  <div>
                    <div className="system_goel_container d-none">
                      {/** Box Model */}
                      {goalHirerachyData.map((goal: any) => (
                        <div
                          className={`box_model ${!checkedSystemGoalsNew.has(goal.id) ? "d-none" : ""
                            }`}
                        >
                          <div className="header">{goal.name}</div>
                          <div>
                            <div>
                              {goal.subGoal.map((subGoal: any) => (
                                <div className="inner_container">
                                  <div className="inner_header">
                                    {subGoal.name}
                                  </div>

                                  {/** KPI's Table */}
                                  {subGoal.kpi.map((kpi: any) => (
                                    <table>
                                      <thead>
                                        <tr>
                                          <th
                                            colSpan={5}
                                            className="kpi_name_title"
                                          >
                                            {kpi.title}
                                          </th>
                                        </tr>
                                        <tr>
                                          <th>&nbsp;</th>
                                          <th>Actual</th>
                                          <th>Target</th>
                                          <th>&nbsp;</th>
                                          <th>Details</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {hirerachicalHospitalData.map(
                                          (organization: any) => {
                                            const allDivisionSelected =
                                              organization.division.every(
                                                (division: any) => {
                                                  // Skip checking if the division name is 'Unknown Hospital'
                                                  if (
                                                    division.name ===
                                                    "Unknown Hospital"
                                                  ) {
                                                    return true;
                                                  }
                                                  // Check if the division is selected
                                                  return selectedHospitalsNew.has(
                                                    division.id
                                                  );
                                                }
                                              );

                                            const divisionRows =
                                              organization.division.map(
                                                (division: any) => {
                                                  const allHospitalsSelected =
                                                    division.hospitals.every(
                                                      (hospital: any) =>
                                                        selectedHospitalsNew.has(
                                                          hospital.id
                                                        )
                                                    );

                                                  return (
                                                    <>
                                                      {division.hospitals.map(
                                                        (hospital: any) => (
                                                          <tr
                                                            className={
                                                              !selectedHospitalsNew.has(
                                                                hospital.id
                                                              ) ||
                                                                [
                                                                  18, 19, 20, 21,
                                                                  22,
                                                                ].indexOf(
                                                                  hospital.id
                                                                ) !== -1
                                                                ? "d-none"
                                                                : ""
                                                            }
                                                          >
                                                            <td>
                                                              <button>
                                                                {hospital.title}
                                                              </button>
                                                            </td>
                                                            <td
                                                              className={
                                                                this.findMatrixValues(
                                                                  subGoal.id,
                                                                  kpi.id,
                                                                  hospital.id,
                                                                  dataGoalMetrix,
                                                                  "ActualVerify"
                                                                ) == true
                                                                  ? "change_status"
                                                                  : ""
                                                              }
                                                            >
                                                              {this.findMatrixValues(
                                                                subGoal.id,
                                                                kpi.id,
                                                                hospital.id,
                                                                dataGoalMetrix,
                                                                "Actual"
                                                              )}
                                                            </td>
                                                            <td
                                                              className={
                                                                this.findMatrixValues(
                                                                  subGoal.id,
                                                                  kpi.id,
                                                                  hospital.id,
                                                                  dataGoalMetrix,
                                                                  "TargetVerified"
                                                                ) == true
                                                                  ? "change_status"
                                                                  : ""
                                                              }
                                                            >
                                                              {this.findMatrixValues(
                                                                subGoal.id,
                                                                kpi.id,
                                                                hospital.id,
                                                                dataGoalMetrix,
                                                                "Target"
                                                              )}
                                                            </td>
                                                            <td>
                                                              <span
                                                                className={
                                                                  this.findMatrixValues(
                                                                    subGoal.id,
                                                                    kpi.id,
                                                                    hospital.id,
                                                                    dataGoalMetrix,
                                                                    "ActualVerify"
                                                                  ) == true
                                                                    ? "success"
                                                                    : "error"
                                                                }
                                                              ></span>
                                                            </td>
                                                            <td>
                                                              <a
                                                                href={this.findMatrixValues(
                                                                  subGoal.id,
                                                                  kpi.id,
                                                                  hospital.id,
                                                                  dataGoalMetrix,
                                                                  "URL"
                                                                )}
                                                                target="_blank"
                                                                className={`details ${this.findMatrixValues(
                                                                  subGoal.id,
                                                                  kpi.id,
                                                                  hospital.id,
                                                                  dataGoalMetrix,
                                                                  "URL"
                                                                ) === null
                                                                    ? "disabled"
                                                                    : ""
                                                                  }`}
                                                              >
                                                                Click
                                                              </a>
                                                            </td>
                                                          </tr>
                                                        )
                                                      )}
                                                      {allHospitalsSelected && (
                                                        <tr
                                                          className={`division_avg ${division.id == null
                                                              ? "d-none"
                                                              : ""
                                                            }`}
                                                        >
                                                          <td>
                                                            <button>
                                                              {division.name}{" "}
                                                              (Avg)
                                                            </button>
                                                          </td>
                                                          <td
                                                            className={
                                                              this.findMatrixValues(
                                                                subGoal.id,
                                                                kpi.id,
                                                                division.id,
                                                                dataGoalMetrix,
                                                                "ActualVerify"
                                                              ) == true
                                                                ? "change_status"
                                                                : ""
                                                            }
                                                          >
                                                            {this.findMatrixValues(
                                                              subGoal.id,
                                                              kpi.id,
                                                              division.id,
                                                              dataGoalMetrix,
                                                              "Actual"
                                                            )}
                                                          </td>
                                                          <td
                                                            className={
                                                              this.findMatrixValues(
                                                                subGoal.id,
                                                                kpi.id,
                                                                division.id,
                                                                dataGoalMetrix,
                                                                "TargetVerified"
                                                              ) == true
                                                                ? "change_status"
                                                                : ""
                                                            }
                                                          >
                                                            {this.findMatrixValues(
                                                              subGoal.id,
                                                              kpi.id,
                                                              division.id,
                                                              dataGoalMetrix,
                                                              "Target"
                                                            )}
                                                          </td>
                                                          <td>
                                                            <span className="success"></span>
                                                          </td>
                                                          <td>
                                                            <a
                                                              href={this.findMatrixValues(
                                                                subGoal.id,
                                                                kpi.id,
                                                                division.id,
                                                                dataGoalMetrix,
                                                                "URL"
                                                              )}
                                                              target="_blank"
                                                              className={`details ${this.findMatrixValues(
                                                                subGoal.id,
                                                                kpi.id,
                                                                division.id,
                                                                dataGoalMetrix,
                                                                "URL"
                                                              ) === null
                                                                  ? "disabled"
                                                                  : ""
                                                                }`}
                                                            >
                                                              Click
                                                            </a>
                                                          </td>
                                                        </tr>
                                                      )}
                                                    </>
                                                  );
                                                }
                                              );

                                            return (
                                              <>
                                                {divisionRows}
                                                {allDivisionSelected && (
                                                  <tr className="organization_avg">
                                                    <td>
                                                      <button>
                                                        {organization.name}{" "}
                                                        (Avg)
                                                      </button>
                                                    </td>
                                                    <td
                                                      className={
                                                        this.findMatrixValues(
                                                          subGoal.id,
                                                          kpi.id,
                                                          organization.id,
                                                          dataGoalMetrix,
                                                          "ActualVerify"
                                                        ) == true
                                                          ? "change_status"
                                                          : ""
                                                      }
                                                    >
                                                      {this.findMatrixValues(
                                                        subGoal.id,
                                                        kpi.id,
                                                        organization.id,
                                                        dataGoalMetrix,
                                                        "Actual"
                                                      )}
                                                    </td>
                                                    <td
                                                      className={
                                                        this.findMatrixValues(
                                                          subGoal.id,
                                                          kpi.id,
                                                          organization.id,
                                                          dataGoalMetrix,
                                                          "TargetVerified"
                                                        ) == true
                                                          ? "change_status"
                                                          : ""
                                                      }
                                                    >
                                                      {this.findMatrixValues(
                                                        subGoal.id,
                                                        kpi.id,
                                                        organization.id,
                                                        dataGoalMetrix,
                                                        "Target"
                                                      )}
                                                    </td>
                                                    <td>
                                                      <span className="success"></span>
                                                    </td>
                                                    <td>
                                                      <a
                                                        href={this.findMatrixValues(
                                                          subGoal.id,
                                                          kpi.id,
                                                          organization.id,
                                                          dataGoalMetrix,
                                                          "URL"
                                                        )}
                                                        target="_blank"
                                                        className={`details ${this.findMatrixValues(
                                                          subGoal.id,
                                                          kpi.id,
                                                          organization.id,
                                                          dataGoalMetrix,
                                                          "URL"
                                                        ) === null
                                                            ? "disabled"
                                                            : ""
                                                          }`}
                                                      >
                                                        Click
                                                      </a>
                                                    </td>
                                                  </tr>
                                                )}
                                              </>
                                            );
                                          }
                                        )}
                                      </tbody>
                                    </table>
                                  ))}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* static */}
                  <div className="system_oprating_model">
                    <div className="system_goel_container">
                      <div className="box_model ">
                        <div className="header">Quality Experience</div>
                        <div>
                          <div>
                            <div className="inner_container">
                              <div className="inner_header">Throughput and Access</div>
                              <table>
                                <thead className="kpi_name_title">
                                  <tr>
                                    <th>
                                      Excess Days
                                      <div>YTD 24: [month-month]</div>
                                    </th>
                                    <th>
                                      Baseline <br /> (FY 23)
                                    </th>
                                    <th>FYTD24</th>
                                    <th>Threshold</th>
                                    <th>Target</th>
                                    <th>Max</th>
                                    <th>Points</th>
                                    <th>Details</th>
                                    <th className="comments">Comments</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr>
                                    <td>
                                      <button>Joslin</button>
                                    </td>
                                    <td>200996</td>
                                    <td>191620</td>
                                    <td>190599</td>
                                    <td>187530</td>
                                    <td>184460</td>
                                    <td>0</td>
                                    <td><a href="" className="details">Click</a></td>
                                    <td>
                                      <textarea defaultValue={""} />
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>
                                      <button>BIDMC</button>
                                    </td>
                                    <td>200996</td>
                                    <td>191620</td>
                                    <td>190599</td>
                                    <td>187530</td>
                                    <td>184460</td>
                                    <td>0</td>
                                    <td><a href="" className="details">Click</a></td>
                                    <td>
                                      <textarea defaultValue={""} />
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                              <table>
                                <thead className="kpi_name_title">
                                  <tr>
                                    <th>
                                      HTN BP Control (%)
                                      <div className="small_title">YTD 24: [month-month]</div>
                                    </th>
                                    <th>
                                      Baseline <br /> (FY 23)
                                    </th>
                                    <th>FYTD24</th>
                                    <th>Threshold</th>
                                    <th>Target</th>
                                    <th>Max</th>
                                    <th>Points</th>
                                    <th>Details</th>
                                    <th className="comments">Comments</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr>
                                    <td>
                                      <button>AJH</button>
                                    </td>
                                    <td>70.8</td>
                                    <td>52.6</td>
                                    <td>76.1</td>
                                    <td>78.1</td>
                                    <td>80.1</td>
                                    <td>0</td>
                                    <td><a href="" className="details">Click</a></td>
                                    <td>
                                      <textarea defaultValue={""} />
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>
                                      <button>LHMC</button>
                                    </td>
                                    <td>70.8</td>
                                    <td>52.6</td>
                                    <td>76.1</td>
                                    <td>78.1</td>
                                    <td>80.1</td>
                                    <td>0</td>
                                    <td><a href="" className="details">Click</a></td>
                                    <td>
                                      <textarea defaultValue={""} />
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>
                                      <button>BIDMC</button>
                                    </td>
                                    <td>70.8</td>
                                    <td>52.6</td>
                                    <td>76.1</td>
                                    <td>78.1</td>
                                    <td>80.1</td>
                                    <td>0</td>
                                    <td><a href="" className="details">Click</a></td>
                                    <td>
                                      <textarea defaultValue={""} />
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                              <table>
                                <thead className="kpi_name_title">
                                  <tr>
                                    <th>
                                      DM BP (%)
                                      <div className="small_title">YTD 24: [month-month]</div>
                                    </th>
                                    <th>
                                      Baseline <br /> (FY 23)
                                    </th>
                                    <th>FYTD24</th>
                                    <th>Threshold</th>
                                    <th>Target</th>
                                    <th>Max</th>
                                    <th>Points</th>
                                    <th>Details</th>
                                    <th className="comments">Comments</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr>
                                    <td>
                                      <button>Joslin</button>
                                    </td>
                                    <td>73.5</td>
                                    <td>53.8</td>
                                    <td>71.7</td>
                                    <td>73.7</td>
                                    <td>75.7</td>
                                    <td>0</td>
                                    <td><a href="" className="details">Click</a></td>
                                    <td>
                                      <textarea defaultValue={""} />
                                    </td>
                                  </tr>
                                  <tr className="division_avg ">
                                    <td>
                                      <button>Metro Boston Division (Avg)</button>
                                    </td>
                                    <td>70.8</td>
                                    <td>52.6</td>
                                    <td>76.1</td>
                                    <td>78.1</td>
                                    <td>80.1</td>
                                    <td>0</td>
                                    <td><a href="" className="details">Click</a></td>
                                    <td>
                                      <textarea defaultValue={""} />
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                              <table>
                                <thead className="kpi_name_title">
                                  <tr>
                                    <th>
                                      DM A1c (%)
                                      <div className="small_title">YTD 24: [month-month]</div>
                                    </th>
                                    <th>
                                      Baseline <br /> (FY 23)
                                    </th>
                                    <th>FYTD24</th>
                                    <th>Threshold</th>
                                    <th>Target</th>
                                    <th>Max</th>
                                    <th>Points</th>
                                    <th>Details</th>
                                    <th className="comments">Comments</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr>
                                    <td>
                                      <button>Joslin</button>
                                    </td>
                                    <td>76.8</td>
                                    <td>40.7</td>
                                    <td>69.1</td>
                                    <td>71.1</td>
                                    <td>73.1</td>
                                    <td>0</td>
                                    <td><a href="" className="details">Click</a></td>
                                    <td>
                                      <textarea defaultValue={""} />
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>
                                      <button>BIDMC</button>
                                    </td>
                                    <td>76.8</td>
                                    <td>40.7</td>
                                    <td>69.1</td>
                                    <td>71.1</td>
                                    <td>73.1</td>
                                    <td>0</td>
                                    <td><a href="" className="details">Click</a></td>
                                    <td>
                                      <textarea defaultValue={""} />
                                    </td>
                                  </tr>
                                  <tr className="division_avg ">
                                    <td>
                                      <button>Metro Boston Division (Avg)</button>
                                    </td>
                                    <td>70.8</td>
                                    <td>52.6</td>
                                    <td>76.1</td>
                                    <td>78.1</td>
                                    <td>80.1</td>
                                    <td>0</td>
                                    <td><a href="" className="details">Click</a></td>
                                    <td>
                                      <textarea defaultValue={""} />
                                    </td>
                                  </tr>
                                </tbody>
                              </table>

                              <table>
                                <thead className="kpi_name_title">
                                  <tr>
                                    <th>
                                      Inpatient Responsisiveness(%)
                                      <div className="small_title">YTD 24: [month-month]</div>
                                    </th>
                                    <th>
                                      Baseline <br /> (FY 23)
                                    </th>
                                    <th>FYTD24</th>
                                    <th>Threshold</th>
                                    <th>Target</th>
                                    <th>Max</th>
                                    <th>Points</th>
                                    <th>Details</th>
                                    <th className="comments">Comments</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr>
                                    <td>
                                      <button>Joslin</button>
                                    </td>
                                    <td>59.5</td>
                                    <td>57.75</td>
                                    <td>59.49</td>
                                    <td>59.51</td>
                                    <td>62.61</td>
                                    <td>0</td>
                                    <td><a href="" className="details">Click</a></td>
                                    <td>
                                      <textarea defaultValue={""} />
                                    </td>
                                  </tr>
                                </tbody>
                              </table>

                              <table>
                                <thead className="kpi_name_title">
                                  <tr>
                                    <th>
                                      Ambulatory Visit Rating (%)
                                      <div className="small_title">YTD 24: [month-month]</div>
                                    </th>
                                    <th>
                                      Baseline <br /> (FY 23)
                                    </th>
                                    <th>FYTD24</th>
                                    <th>Threshold</th>
                                    <th>Target</th>
                                    <th>Max</th>
                                    <th>Points</th>
                                    <th>Details</th>
                                    <th className="comments">Comments</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr>
                                    <td>
                                      <button>Joslin</button>
                                    </td>
                                    <td>87.7</td>
                                    <td>88.93</td>
                                    <td>87.87</td>
                                    <td>87.8</td>
                                    <td>87.9</td>
                                    <td>0</td>
                                    <td><a href="" className="details">Click</a></td>
                                    <td>
                                      <textarea defaultValue={""} />
                                    </td>
                                  </tr>
                                  <tr className="division_avg ">
                                    <td>
                                      <button>Metro Boston Division (Avg)</button>
                                    </td>
                                    <td>70.8</td>
                                    <td>52.6</td>
                                    <td>76.1</td>
                                    <td>78.1</td>
                                    <td>80.1</td>
                                    <td>0</td>
                                    <td><a href="" className="details">Click</a></td>
                                    <td>
                                      <textarea defaultValue={""} />
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                              <table>
                                <thead className="kpi_name_title">
                                  <tr>
                                    <th>
                                      Readmissions (%)
                                      <div className="small_title">YTD 24: [month-month]</div>
                                    </th>
                                    <th>
                                      Baseline <br /> (FY 23)
                                    </th>
                                    <th>FYTD24</th>
                                    <th>Threshold</th>
                                    <th>Target</th>
                                    <th>Max</th>
                                    <th>Points</th>
                                    <th>Details</th>
                                    <th className="comments">Comments</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr>
                                    <td>
                                      <button>Joslin</button>
                                    </td>
                                    <td>10.71</td>
                                    <td>10.69</td>
                                    <td>10.25</td>
                                    <td>10.05</td>
                                    <td>9.85</td>
                                    <td>0</td>
                                    <td><a href="" className="details">Click</a></td>
                                    <td>
                                      <textarea defaultValue={""} />
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              ))}
            </div>
          </div>
        </div>
        <div className={styles.dummy}></div>
      </section>
    );
  }
}

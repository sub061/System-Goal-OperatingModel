import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  type IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { IReadonlyTheme } from '@microsoft/sp-component-base';
import { SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http';
import * as strings from 'SystemGoalOperatingModelWebPartStrings';
import SystemGoalOperatingModel from './components/SystemGoalOperatingModel';
import { IGoal, IGoalMetrix, IHospital, IKPI, IOperatingModel, ISubGoal, ISystemGoal, ISystemGoalOperatingModelProps } from './components/ISystemGoalOperatingModelProps';

export interface ISystemGoalOperatingModelWebPartProps {
  description: string;
  title: string;
  goal: string;
  system_goal: string;
  sub_goal: string;
  division: string;
  hospital: string;
  kpi: string;
  metrix: string;
}

export default class SystemGoalOperatingModelWebPart extends BaseClientSideWebPart<ISystemGoalOperatingModelWebPartProps> {

 public async onInit(): Promise<void> {
    // console.log('onInit called');
    await super.onInit();
    // console.log('onInit finished');
  }


    // Get List for System Goal
  public async getSystemGoalConfiguration(): Promise<ISystemGoal[]> {
    const requestUrl = `${this.context.pageContext.web.absoluteUrl}/_api/web/Lists/GetByTitle('${this.properties.system_goal}')/Items`;
    // console.log('Fetching description data from:', requestUrl);
    const response: SPHttpClientResponse = await this.context.spHttpClient.get(requestUrl, SPHttpClient.configurations.v1);
    const data = await response.json();
    // console.log('Data fetched:', data);
    return data.value; 
  }

  // Get List for System Goal
  public async getGoalConfiguration(): Promise<IGoal[]> {
    const requestUrl = `${this.context.pageContext.web.absoluteUrl}/_api/web/Lists/GetByTitle('${this.properties.goal}')/Items`;
    // console.log('Fetching goal data from:', requestUrl);
    const response: SPHttpClientResponse = await this.context.spHttpClient.get(requestUrl, SPHttpClient.configurations.v1);
    const data = await response.json();
    // console.log('Data fetched:', data);
    return data.value; 
  }

  // Get List for System Goal
  public async getSubGoalConfiguration(): Promise<ISubGoal[]> {
    const requestUrl = `${this.context.pageContext.web.absoluteUrl}/_api/web/Lists/GetByTitle('${this.properties.sub_goal}')/Items`;
    // console.log('Fetching sub_goal data from:', requestUrl);
    const response: SPHttpClientResponse = await this.context.spHttpClient.get(requestUrl, SPHttpClient.configurations.v1);
    const data = await response.json();
    // console.log('Data fetched:', data);
    return data.value; 
  }

  // Get List for System Goal
  public async getKPIConfiguration(): Promise<IKPI[]> {
    const requestUrl = `${this.context.pageContext.web.absoluteUrl}/_api/web/Lists/GetByTitle('${this.properties.kpi}')/Items`;
    // console.log('Fetching kpi data from:', requestUrl);
    const response: SPHttpClientResponse = await this.context.spHttpClient.get(requestUrl, SPHttpClient.configurations.v1);
    const data = await response.json();
    // console.log('Data fetched:', data);
    return data.value; 
  }

// Get List for Division
  public async getDivisionConfiguration(): Promise<IHospital[]> {
    const requestUrl = `${this.context.pageContext.web.absoluteUrl}/_api/web/Lists/GetByTitle('${this.properties.hospital}')/Items`;
    // console.log('Fetching Division data from:', requestUrl);
    const response: SPHttpClientResponse = await this.context.spHttpClient.get(requestUrl, SPHttpClient.configurations.v1);
    const data = await response.json();
    // console.log('Data fetched:', data);
    // Filter the data to include only those items where Division is not null
    const filteredData = data.value.filter((item: IHospital) => item.DivisionId == null);
    // console.log('filter hospital Data fetched:', filteredData);
    return filteredData; 
    
  }


   // Get List for full hospital list
  public async getAllHospitalConfiguration(): Promise<IHospital[]> {
    const requestUrl = `${this.context.pageContext.web.absoluteUrl}/_api/web/Lists/GetByTitle('${this.properties.hospital}')/Items`;
    // console.log('Fetching hospital data from:', requestUrl);
    const response: SPHttpClientResponse = await this.context.spHttpClient.get(requestUrl, SPHttpClient.configurations.v1);
    const data = await response.json();
    // console.log('hospital Data fetched:', data);
 
    return data.value; 
  }

  // Get List for System Goal
  public async getHospitalConfiguration(): Promise<IHospital[]> {
    const requestUrl = `${this.context.pageContext.web.absoluteUrl}/_api/web/Lists/GetByTitle('${this.properties.hospital}')/Items`;
    // console.log('Fetching hospital data from:', requestUrl);
    const response: SPHttpClientResponse = await this.context.spHttpClient.get(requestUrl, SPHttpClient.configurations.v1);
    const data = await response.json();
    // console.log('hospital Data fetched:', data);

// Filter the data to include only those items where Division is not null
    const filteredData = data.value.filter((item: IHospital) => item.DivisionId !== null);
// console.log('filter hospital Data fetched:', filteredData);
    return filteredData; 
  }

  // Get List for System Goal
  public async getGoalMetrixConfiguration(): Promise<IGoalMetrix[]> {
    const requestUrl = `${this.context.pageContext.web.absoluteUrl}/_api/web/Lists/GetByTitle('${this.properties.metrix}')/Items?$top=5000`;
    // console.log('Fetching goal data from:', requestUrl);
    const response: SPHttpClientResponse = await this.context.spHttpClient.get(requestUrl, SPHttpClient.configurations.v1);
    const data = await response.json();
    // console.log('Data fetched:', data);
    return data.value; 
  }


  // Get List for Operating Model
  public async getOperatingModelConfiguration(): Promise<IOperatingModel[]> {
    const requestUrl = `${this.context.pageContext.web.absoluteUrl}/_api/web/Lists/GetByTitle('Operating Model')/Items`;
    // console.log('Fetching goal data from:', requestUrl);
    const response: SPHttpClientResponse = await this.context.spHttpClient.get(requestUrl, SPHttpClient.configurations.v1);
    const data = await response.json();
    return data.value; 
  }

  public render(): void {
    // console.log('render called');
    if (!this.domElement) {
      // console.error('domElement is not available');
      return;
    }
    if(this.domElement) this.renderContent();
  }


  // public render(): void {
  //   const element: React.ReactElement<ISystemGoalOperatingModelProps> = React.createElement(
  //     SystemGoalOperatingModel,
  //     {
  //       description: this.properties.description,
  //       isDarkTheme: this._isDarkTheme,
  //       environmentMessage: this._environmentMessage,
  //       hasTeamsContext: !!this.context.sdks.microsoftTeams,
  //       userDisplayName: this.context.pageContext.user.displayName
  //     }
  //   );

  //   ReactDom.render(element, this.domElement);
  // }

  protected async renderContent(): Promise<void> {
    try {
      const getOperatingModel = await this.getOperatingModelConfiguration();
      const getGoalMetrix = await this.getGoalMetrixConfiguration();
      const getHospital = await this.getHospitalConfiguration();
      const getDivision = await this.getDivisionConfiguration();
      const getKPI = await this.getKPIConfiguration();
      const getSubGoal = await this.getSubGoalConfiguration();
      const getGoal = await this.getGoalConfiguration();
      const getSystemGoal = await this.getSystemGoalConfiguration();
      const getAllHospital = await this.getAllHospitalConfiguration();
      
      const pageTitle = this.properties.title;

      const element: React.ReactElement<ISystemGoalOperatingModelProps> = React.createElement(
        SystemGoalOperatingModel,
        {
          title:pageTitle,
          description: this.properties.description,  
          getOperatingModel: getOperatingModel,
          getGoalMetrix: getGoalMetrix,
          getDivision: getDivision,
          getHospital: getHospital,
          getKPI: getKPI,
          getSubGoal: getSubGoal,
          getGoal: getGoal,
          getSystemGoal: getSystemGoal,
          getAllHospital:getAllHospital,
          
        }
      );

      const domElement = document.querySelector('[data-sp-web-part-id="0d46ba9c-5483-423a-8bd0-a366a99a6608"]');
      // console.log("Dom element ---->", domElement)
      // console.log("element ---->", element);

      if (domElement) {
        ReactDom.render(element, domElement);
      } else {
        // console.error('The specified DOM element is not found.');
      }
    } catch (error) {
      // console.error('Error during render:', error);
    }
  }




  // private _getEnvironmentMessage(): Promise<string> {
  //   if (!!this.context.sdks.microsoftTeams) { // running in Teams, office.com or Outlook
  //     return this.context.sdks.microsoftTeams.teamsJs.app.getContext()
  //       .then(context => {
  //         let environmentMessage: string = '';
  //         switch (context.app.host.name) {
  //           case 'Office': // running in Office
  //             environmentMessage = this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentOffice : strings.AppOfficeEnvironment;
  //             break;
  //           case 'Outlook': // running in Outlook
  //             environmentMessage = this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentOutlook : strings.AppOutlookEnvironment;
  //             break;
  //           case 'Teams': // running in Teams
  //           case 'TeamsModern':
  //             environmentMessage = this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentTeams : strings.AppTeamsTabEnvironment;
  //             break;
  //           default:
  //             environmentMessage = strings.UnknownEnvironment;
  //         }

  //         return environmentMessage;
  //       });
  //   }

  //   return Promise.resolve(this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentSharePoint : strings.AppSharePointEnvironment);
  // }

  protected onThemeChanged(currentTheme: IReadonlyTheme | undefined): void {
    if (!currentTheme) {
      return;
    }

    const {
      semanticColors
    } = currentTheme;

    if (semanticColors) {
      this.domElement.style.setProperty('--bodyText', semanticColors.bodyText || null);
      this.domElement.style.setProperty('--link', semanticColors.link || null);
      this.domElement.style.setProperty('--linkHovered', semanticColors.linkHovered || null);
    }

  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              
              groupFields: [

                 PropertyPaneTextField('title', {
                   label: 'Title',
                  // value: 'BILH Operating Model' // Set default value here
                },
                ),
                PropertyPaneTextField('system_goal', {
                  label: 'System Goal',
                 // value: 'Organization' // Set default value here
                },
                ),
                
                PropertyPaneTextField('goal', {
                  label: 'Goal',
                 // value: 'Goal' // Set default value here
                },
                ),
                
                PropertyPaneTextField('sub_goal', {
                  label: 'Sub Goal',
                  //value: 'Sub Goal' // Set default value here
                },
                ),
                
                PropertyPaneTextField('kpi', {
                  label: 'KPI',
                 // value: 'KPI' // Set default value here
                },
                ),
                 PropertyPaneTextField('division', {
                   label: 'Division',
                  // value: 'Division' // Set default value here
                },
                ),
                PropertyPaneTextField('hospital', {
                  label: 'Hospital',
                 // value: 'Hospital' // Set default value here
                },
                ),
                PropertyPaneTextField('metrix', {
                  label: 'Metrix',
                 // value: 'Goal Metrix' // Set default value here
                },
                )

              ]
            }
          ]
        }
      ]
    };
  }
}

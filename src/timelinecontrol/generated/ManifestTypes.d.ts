/*
*This is auto generated from the ControlManifest.Input.xml file
*/

// Define IInputs and IOutputs Type. They should match with ControlManifest.
export interface IInputs {
    reloadTimeline: ComponentFramework.PropertyTypes.StringProperty;
    reloadData: ComponentFramework.PropertyTypes.StringProperty;
    editMode: ComponentFramework.PropertyTypes.TwoOptionsProperty;
    customCss: ComponentFramework.PropertyTypes.StringProperty;
    datagroups: ComponentFramework.PropertyTypes.StringProperty;
    dataitems: ComponentFramework.PropertyTypes.StringProperty;
    optionStart: ComponentFramework.PropertyTypes.DateTimeProperty;
    optionEnd: ComponentFramework.PropertyTypes.DateTimeProperty;
    optionStack: ComponentFramework.PropertyTypes.TwoOptionsProperty;
    optionStackSubgroups: ComponentFramework.PropertyTypes.TwoOptionsProperty;
    optionVerticalScroll: ComponentFramework.PropertyTypes.TwoOptionsProperty;
    optionHorizontalScroll: ComponentFramework.PropertyTypes.TwoOptionsProperty;
    optionMaxHeight: ComponentFramework.PropertyTypes.WholeNumberProperty;
    listItems: ComponentFramework.PropertyTypes.StringProperty;
    listCSS: ComponentFramework.PropertyTypes.StringProperty;
}
export interface IOutputs {
    reloadTimeline?: string;
    reloadData?: string;
    customCss?: string;
    datagroups?: string;
    dataitems?: string;
    listItems?: string;
    listCSS?: string;
    selectedItem?: string;
    timelineJSON?: string;
    selectedModifer?: string;
    timelineStart?: Date;
    timelineEnd?: Date;
    removedJSON?: string;
}

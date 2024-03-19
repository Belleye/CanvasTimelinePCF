//import {IInputs, IOutputs} from "./generated/ManifestTypes";
//import { IOutputs } from "./generated/ManifestTypes";
import { Timeline } from 'vis-timeline/esnext/esm/vis-timeline-graph2d';
import { DataSet } from 'vis-data';
import Hammer from '@egjs/hammerjs';
//import propagating from 'propagating-hammerjs';

interface IInputs {
    reloadTimeline: ComponentFramework.PropertyTypes.StringProperty;
    reloadData: ComponentFramework.PropertyTypes.StringProperty;
    editMode: ComponentFramework.PropertyTypes.TwoOptionsProperty;
    customCss: ComponentFramework.PropertyTypes.StringProperty;
    dataitems: ComponentFramework.PropertyTypes.StringProperty;
    datagroups: ComponentFramework.PropertyTypes.StringProperty;
    optionStart: ComponentFramework.PropertyTypes.StringProperty;
    optionEnd: ComponentFramework.PropertyTypes.StringProperty;
    optionStack: ComponentFramework.PropertyTypes.TwoOptionsProperty;
    optionStackSubgroups: ComponentFramework.PropertyTypes.TwoOptionsProperty;
    optionVerticalScroll: ComponentFramework.PropertyTypes.TwoOptionsProperty;
    optionHorizontalScroll: ComponentFramework.PropertyTypes.TwoOptionsProperty;

    listItems: ComponentFramework.PropertyTypes.StringProperty;
    listCSS: ComponentFramework.PropertyTypes.StringProperty;

}

interface IOutputs {
    selectedItem?: string;
    timelineJSON?: string;
    selectedModifer?: string;
    removedJSON?: string; 
}

interface TimelineOptions {
    start?: string;
    end?: string;
    stack: boolean;
    stackSubgroups: boolean;
    verticalScroll: boolean;
    horizontalScroll: boolean;
    autoResize: boolean;
    minHeight: number;
    orientation: string;
    zoomKey: 'ctrlKey';
    width: string;
    tooltip: { followMouse: boolean };
    groupOrder: string | ((a: any, b: any) => number);
    editable: boolean | {
        add: boolean;
        updateTime: boolean;
        updateGroup: boolean;
        remove: boolean;
    };
    snap?: (date: Date, scale: string, step: number) => Date;
    onDropObjectOnItem?: (props: TimelineEventProperties) => void;
    onAdd?: (item: any, callback: (item?: any) => void) => void;
    onMove?: (item: any, callback: (item?: any) => void) => void;
    onRemove?: (item: any, callback: (item?: any) => void) => void;
    // Add any other properties that are used in the options object
}

interface TimelineEventProperties {
    group: number | null;
    item: number | null;
    customTime: number | null;
    pageX: number;
    pageY: number;
    x: number;
    y: number;
    time: Date;
    snappedTime: Date;
    what: string | null;
    event: Event;
}

class TimelineData { //an array that stores the timeline data
    id: string;
    group: string;
    content: string;
    //subgroup: number;
    title: string;
    start: string;
    end: string;
    type: string;
    className: string;
    editable: boolean | undefined;
    isNew: boolean | false;
    isEdited: boolean | false;
    isRemoved: boolean | false;


    constructor(id: string, group: string, content: string, title: string, start: string, end: string, type: string, className: string, editable: boolean, isNew: boolean, isEdited: boolean, isRemoved: boolean) { //subgroup: number, 
        this.id = id;
        this.group = group;
        this.content = content;
        //this.subgroup = subgroup,
        this.title = title;
        this.start = start;
        this.end = end;
        this.type = type;
        this.className = className;
        this.editable = editable;
        this.isNew = isNew;
        this.isEdited = isEdited;
        this.isRemoved = isRemoved;
    }
}

class timelineGroups {
    id: string;
    content: string;
    //subgroupOrder?: ((a: any, b: any) => number);
    nestedGroups?: Array<string>;
    visible?: boolean;
    //constructor(id: string, content: string, subgroupOrder?: ((a: any, b: any) => number), nestedGroups?: Array<string>, visible?: boolean) {
    constructor(id: string, content: string, nestedGroups?: Array<string>, visible?: boolean) {
        this.id = id;
        this.content = content;
        //this.subgroupOrder = subgroupOrder;
        this.nestedGroups = nestedGroups;
        this.visible = visible;
    }
}

export class timelinecontrol implements ComponentFramework.StandardControl<IInputs, IOutputs> {
    private _timelineElm: HTMLDivElement;
    private _timelineData: TimelineData[] = [];
    private _timelineGroups: timelineGroups[] = [];
    private _timelineVis: any;
    private _selectedItemId: string | undefined = undefined;
    private _selectedModifier: string | undefined = undefined;
    private _timelineJSON: string | undefined = undefined;
    private _notifyOutputChanged: () => void;
    private _reloadTimeline: string | undefined = undefined;
    private _reloadData: string | undefined = undefined;
    // tracked variables to determine if timeline should be reloaded
    private _stack: boolean | undefined = undefined;
    private _stackSubgroups: boolean | undefined = undefined;
    private _verticalScroll: boolean | undefined = undefined;
    private _horizontalScroll: boolean | undefined = undefined;
    private _editMode: boolean | undefined = undefined;
    private _listItems: string | undefined | undefined = undefined;
    private _dataitems: string | undefined | undefined = undefined;
    private _datagroups: string | undefined | undefined = undefined;
    private _start: string | null = null;
    private _end: string | null = null;
    private _removedJSON: string | undefined = undefined;
    private _removedArr: any[] = [];


    /**
     * Empty constructor.
     */
    constructor() {

    }
    public updateGlobalVars(updates: {
        reloadTimeline?: string | undefined,
        reloadData?: string | undefined,
        selectedModifier?: string,

        stack?: boolean | undefined,
        stackSubgroups?: boolean | undefined,
        verticalScroll?: boolean | undefined,
        horizontalScroll?: boolean | undefined,
        editMode?: boolean | undefined,
        listItems?: string | undefined,
        dataitems?: string | undefined,
        datagroups?: string | undefined,
        start?: string | null,
        end?: string | null
    }): void {
        if (updates.reloadTimeline !== undefined) this._reloadTimeline = updates.reloadTimeline;
        if (updates.reloadData !== undefined) this._reloadData = updates.reloadData;
        if (updates.selectedModifier !== undefined) this._selectedModifier = updates.selectedModifier;
        if (updates.stack !== undefined) this._stack = updates.stack;
        if (updates.stackSubgroups !== undefined) this._stackSubgroups = updates.stackSubgroups;
        if (updates.verticalScroll !== undefined) this._verticalScroll = updates.verticalScroll;
        if (updates.horizontalScroll !== undefined) this._horizontalScroll = updates.horizontalScroll;
        if (updates.editMode !== undefined) this._editMode = updates.editMode;
        if (updates.listItems !== undefined) this._listItems = updates.listItems;
        if (updates.dataitems !== undefined) this._dataitems = updates.dataitems;
        if (updates.datagroups !== undefined) this._datagroups = updates.datagroups;
        if (updates.start !== undefined) this._start = updates.start;
        if (updates.end !== undefined) this._end = updates.end;
    }
    private onItemSelected(itemId: string): void {
        console.log("Notify Powerapps");
        this._selectedItemId = itemId;
        this._timelineJSON = JSON.stringify(this._timelineVis.itemsData.get());
        //this._selectedModifier = selectedModifier;
        this._notifyOutputChanged(); // Notify PowerApps that there's new data
    }

    /**
     * Used to initialize the control instance. Controls can kick off remote server calls and other initialization actions here.
     * Data-set values are not initialized here, use updateView.
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to property names defined in the manifest, as well as utility functions.
     * @param notifyOutputChanged A callback method to alert the framework that the control has new outputs ready to be retrieved asynchronously.
     * @param state A piece of data that persists in one session for a single user. Can be set at any point in a controls life cycle by calling 'setControlState' in the Mode interface.
     * @param container If a control is marked control-type='standard', it will receive an empty div element within which it can render its content.
     */
    public init(context: ComponentFramework.Context<IInputs>, notifyOutputChanged: () => void, state: ComponentFramework.Dictionary, container: HTMLDivElement): void {
        // Add control initialization code
        // Create a parent div to hold all elements with flexbox layout
        const parentDiv = document.createElement('div');
        parentDiv.id = 'parent-container';
        parentDiv.style.display = 'flex';

        // Create the list items container div
        const listItemsDiv = document.createElement('div');
        listItemsDiv.id = 'list-items-container';
        listItemsDiv.className = 'list-items'; // Add your CSS class for styling the list items
        listItemsDiv.style.flex = '0 0 auto'; // Assign flex to take necessary space

        // Add a placeholder list item
        const placeholderItem = document.createElement('div');
        placeholderItem.textContent = 'Placeholder Item'; // Text for the placeholder item
        placeholderItem.className = 'list-item-placeholder'; // Add your CSS class for styling the placeholder item

        listItemsDiv.appendChild(placeholderItem); // Append the placeholder item to the list items container div
        parentDiv.appendChild(listItemsDiv); // Append the list items container div to the parent container

        // Create the timeline div
        this._timelineElm = document.createElement("div");
        this._timelineElm.id = 'unique-timeline-id'; // Ensure this ID is unique
        this._timelineElm.className = 'timeline-class'; // Add your CSS class for styling the timeline
        this._timelineElm.style.flex = '1'; // Assign flex to take necessary space
        parentDiv.appendChild(this._timelineElm); // Append the timeline div to the parent container

        // Append the parent div to the main container
        container.appendChild(parentDiv);

        this._notifyOutputChanged = notifyOutputChanged;
    }

    /**
     * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
     */
    public updateView(context: ComponentFramework.Context<IInputs>): void {

        // Inject Custom CSS
        this.injectCustomCss(context);
        // Generate list items

        if (this._reloadTimeline !== context.parameters.reloadTimeline.raw){
            this._selectedModifier = "None";
            this.updateGlobalVars(
                {
                    reloadTimeline: context.parameters.reloadTimeline.raw || undefined
                }
            )
            this._notifyOutputChanged();
        }

        if (this._listItems !== context.parameters.listItems.raw) {
            const listItems = JSON.parse(context.parameters.listItems.raw || "[]");
            this.updateListItems(listItems, context.parameters.editMode.raw, context);
            this.updateGlobalVars(
                {
                    listItems: context.parameters.listItems.raw || undefined
                }
            )
        }

        // Check if the timeline has already been created
        if (!this._timelineVis) {
            // Timeline has not been created yet, so create it
            const options = this.getTimelineOptions(context);
            this._timelineVis = new Timeline(this._timelineElm, this._timelineData, this._timelineGroups, options);
            this.attachEventHandlers(); // Attach event handlers after creating the timeline
        }

        // Update the timeline's data
        if ((this._stack !== context.parameters.optionStack.raw)
            || (this._stackSubgroups !== context.parameters.optionStackSubgroups.raw)
            || (this._verticalScroll !== context.parameters.optionVerticalScroll.raw)
            || (this._horizontalScroll !== context.parameters.optionHorizontalScroll.raw)
            || (this._editMode !== context.parameters.editMode.raw)
            || (String(this._start) !== String(context.parameters.optionStart.raw))
            || (String(this._end) !== String(context.parameters.optionEnd.raw))) {
            const options2 = this.getTimelineOptions(context);
            this._timelineVis.setOptions(options2);
            this.updateGlobalVars(
                {
                    stack: context.parameters.optionStack.raw,
                    stackSubgroups: context.parameters.optionStackSubgroups.raw,
                    verticalScroll: context.parameters.optionVerticalScroll.raw,
                    horizontalScroll: context.parameters.optionHorizontalScroll.raw,
                    editMode: context.parameters.editMode.raw,
                    start: context.parameters.optionStart.raw,
                    end: context.parameters.optionEnd.raw
                }
            )
        }

        if ((this._dataitems !== context.parameters.dataitems.raw)  || (this._reloadData !== context.parameters.reloadData.raw)) {
            console.log("dataitems: "+ (this._dataitems !== context.parameters.dataitems.raw));
            console.log("reloadData: "+ (this._reloadData !== context.parameters.reloadData.raw));
            this._removedArr = [];
            this._removedJSON = "";
            this.updateGlobalVars(
                {
                    dataitems: context.parameters.dataitems.raw || undefined,
                    reloadData: context.parameters.reloadData.raw || undefined
                }
            )
            this.createTimelineData(context);
            this._timelineVis.setItems(this._timelineData);
            this._timelineJSON = JSON.stringify(this._timelineVis.itemsData.get());
            this._notifyOutputChanged();
        }

        if (this._datagroups !== context.parameters.datagroups.raw) {
            this.createTimelineGroups(context);
            this._timelineVis.setGroups(this._timelineGroups);
            this.updateGlobalVars(
                {
                    datagroups: context.parameters.datagroups.raw || undefined
                }
            )
        }

        
    }

    // Helper method to parse duration string to milliseconds
    private handleDragStart(event: DragEvent, itemData: any): void {
        const dragSrcEl = event.target as HTMLElement; // Cast to HTMLElement if needed
        let isEditMode = true;
        this._timelineVis.setOptions(
            {
                editable: true
            }
        );
        if (event.dataTransfer) {
            event.dataTransfer.effectAllowed = 'move';
            const item = {
                id: new Date().toISOString(), // Use ISO string for the ID to ensure uniqueness
                type: itemData.type,
                content: itemData.content,
                className: itemData.visClassName,
                duration: itemData.duration
            };
            event.dataTransfer.setData("text", JSON.stringify(item));
        }
    }

    private handleDragEnd(event: DragEvent, itemData: any, context: ComponentFramework.Context<IInputs>): void {
        const dragSrcEl = event.target as HTMLElement; // Cast to HTMLElement if needed
        let isEditMode = context.parameters.editMode.raw;
        this._timelineVis.setOptions(
            {
                editable: {
                    add: false, // disable adding new items on double click regardless of edit mode
                    updateTime: isEditMode, // allow dragging items to change their time if edit mode is true
                    updateGroup: isEditMode, // allow dragging items from one group to another if edit mode is true
                    remove: isEditMode, // allow item removal if edit mode is true
                }
            }
        );
    }

    private injectCustomCss(context: ComponentFramework.Context<IInputs>): void {
        let customCss = (context.parameters.customCss.raw || "") + (context.parameters.listCSS.raw || "");
        let styleTag = document.getElementById('custom-css-style') as HTMLStyleElement | null;
        if (!styleTag) {
            styleTag = document.createElement('style');
            styleTag.id = 'custom-css-style';
            document.head.appendChild(styleTag);
        }

        if ((styleTag as any).styleSheet) {
            (styleTag as any).styleSheet.cssText = customCss;
        } else {
            styleTag.textContent = customCss;
        }
    }

    // Helper method to add a new item to the timeline's dataset and refresh the timeline
    private addTimelineItem(item: any): void {
        if (item.type === 'range') {
            item.end = new Date(new Date(item.start).getTime() + item.duration);
        }
        item.isNew = true;
        item.isEdited = true;
        item.editable = true;
        item.title = "New " + item.type;
    }

    private attachEventHandlers(): void {
        var selKey = "None";
        document.addEventListener('keydown', (event: KeyboardEvent) => {
            if (event.ctrlKey) {
                selKey = "Ctrl";
            } else if (event.altKey) {
                selKey = "Alt";
            } else if (event.shiftKey) {
                selKey = "Shift";
            }
        });

        document.addEventListener('keyup', (event: KeyboardEvent) => {
            // Reset the modifier when the key is released
            selKey = "None";
        });
        this._timelineVis.on('select', (properties: any) => {
            //console.log("select");
            if (properties.items && properties.items.length > 0) {
                const selectedItemId = properties.items[0]; // Assuming single selection
                if (selKey !== "None"){
                this._selectedModifier = selKey;
                }
                this.onItemSelected(selectedItemId);
            }
        });

    }

    /**
     * It is called by the framework prior to a control receiving new data.
     * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as “bound” or “output”
     */
    public getOutputs(): IOutputs {
        return {
            selectedItem: this._selectedItemId || undefined,
            timelineJSON: this._timelineJSON || undefined,
            selectedModifer: this._selectedModifier || undefined,
            removedJSON: this._removedJSON || undefined
        };
    }

    /**
     * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
     * i.e. cancelling any pending remote calls, removing listeners, etc.
     */
    public destroy(): void {
        // Add code to cleanup control if necessary
    }
    private getTimelineOptions(context: ComponentFramework.Context<IInputs>): TimelineOptions {
        let isEditMode = context.parameters.editMode.raw;
        let options: TimelineOptions = {
            start: context.parameters.optionStart.raw || undefined,
            end: context.parameters.optionEnd.raw || undefined,
            stack: context.parameters.optionStack.raw !== null ? context.parameters.optionStack.raw : false,
            stackSubgroups: context.parameters.optionStackSubgroups.raw !== null ? context.parameters.optionStackSubgroups.raw : false,
            verticalScroll: context.parameters.optionVerticalScroll.raw !== null ? context.parameters.optionVerticalScroll.raw : true,
            horizontalScroll: context.parameters.optionHorizontalScroll.raw !== null ? context.parameters.optionHorizontalScroll.raw : true,
            autoResize: true,
            minHeight: 100,
            orientation: 'both',
            zoomKey: 'ctrlKey' as const,
            width: '100%',
            tooltip: { followMouse: true },
            groupOrder: 'order',
            editable: isEditMode ? {
                add: false, // keep add as false
                updateTime: true, // allow updateTime if edit mode is true
                updateGroup: true, // allow updateGroup if edit mode is true
                remove: true // allow remove if edit mode is true
            } : false,
            snap: (date: Date, scale: string, step: number) => {
                const hour = 5 * 60 * 1000; // the granularity of the time movement
                return new Date(Math.round(date.getTime() / hour) * hour);
            },
            onAdd: (item: any, callback: (item?: any) => void) => {
                //console.log(item);
                this.addTimelineItem(item);
                callback(item);
                this.onItemSelected(item.id); // Assuming onItemSelected expects an item ID
            },
            onMove: (item: any, callback: (item?: any) => void) => {
                //console.log(item.id);
                item.isEdited = true;
                callback(item);
                this.onItemSelected(item.id);
            },
            onRemove: (item: any, callback: (item?: any) => void) => {
                //console.log(item.id);
                item.isRemoved = true;
                this._removedArr.push(item.id);
                this._removedJSON = JSON.stringify(this._removedArr);
                this._timelineJSON = JSON.stringify(this._timelineVis.itemsData.get());
                callback(item);
                this._notifyOutputChanged();
                //this.onItemSelected(item.id);
            }
            //timeAxis: {scale: 'hour' as const, step: 1},
            // ... other options ...
        };
        return options;
    }
    private createTimelineData(context: ComponentFramework.Context<IInputs>): void {
        let dataitems = context.parameters.dataitems.raw || "[]";
        let parsedItems = JSON.parse(dataitems);
        let isEditMode = context.parameters.editMode.raw; // Get the edit mode from the context


        this._timelineData = [];

        if (parsedItems.length > 0) {
            parsedItems.forEach((item: any) => {
                this._timelineData.push(new TimelineData(
                    item.id,
                    item.group,
                    item.content,
                    //item.subgroup,
                    item.title,
                    item.start,
                    item.end,
                    item.type,
                    item.className,
                    item.editable !== undefined ? item.editable : isEditMode, // Use the edit mode if editable is not explicitly set
                    item.isNew === undefined ? false : false,
                    item.isEdited === undefined ? false : false,
                    item.isRemoved === undefined ? false : false
                ));
            });
        } else {
            // Handle no data
            console.log("No data items provided for the timeline.");
        }
    }
    private updateListItems(listItems: any[], editMode: boolean, context: ComponentFramework.Context<IInputs>): void {
        const listItemsDiv = document.getElementById('list-items-container') as HTMLDivElement;
        // Clear existing list items
        while (listItemsDiv.firstChild) {
            listItemsDiv.removeChild(listItemsDiv.firstChild);
        }

        if (editMode) {
            // Create and append new list items
            listItems.forEach(item => {
                const listItem = document.createElement('div');
                listItem.id = item.id;
                listItem.textContent = item.content;
                listItem.className = item.className;
                listItem.setAttribute('draggable', 'true');
                listItem.addEventListener('dragstart', (event: DragEvent) => this.handleDragStart(event, item), false);
                listItem.addEventListener('dragend', (event: DragEvent) => this.handleDragEnd(event, item, context), false);
                listItemsDiv.appendChild(listItem);
            });
            listItemsDiv.style.display = 'block';
        } else {
            listItemsDiv.style.display = 'none';
        }
    }
    private createTimelineGroups(context: ComponentFramework.Context<IInputs>): void {
        let dataitems = context.parameters.datagroups.raw || "[]";
        let parsedItems = JSON.parse(dataitems);
        this._timelineGroups = [];

        if (parsedItems.length > 0) {
            parsedItems.forEach((item: any) => {
                let group = new timelineGroups(
                    item.id.toString(),
                    item.content,
                    //undefined,
                    item.nestedGroups,
                    item.visible
                );
                //if (group.nestedGroups && group.nestedGroups.length > 0) {
                //    // Set the subgroupOrder function for groups with nested groups
                //    group.subgroupOrder = this.customSubgroupOrder;
                //}
                this._timelineGroups.push(group);
            });
        } else {
            // Handle no data
            console.log("No data items provided for the timeline groups.");
        }
    }
}

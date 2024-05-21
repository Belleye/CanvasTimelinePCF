# Data Schema
This is the table schema of the 2nd published solution (PowerAppsToolsTemp_dev_1_1.zip).

## DataGroups
Data groups holds all the information for the left column of the Gantt, it contains individual items and parent grouping.

| Column Name | Data Type               | Comment                                                              |
| ----------- | ----------------------- | -------------------------------------------------------------------- |
| id          | Unique Single Line Text |                                                                      |
| content     | Single Line Text        | Displayed on the left column of the Gantt chart                      |
| nested      | Single Line Text        | Lists the children under the item in the content column if not blank |
| visible     | Boolean/Yes/No          | Applicable only if the nested column is not blank                    |

Example data

| id        | content  | nested   | visible |
|-----------|----------|----------|---------|
| 1         | Shop 1   | Machine 1| TRUE    |
| 1         | Shop 1   | Machine 2| TRUE    |
| 1         | Shop 1   | Machine 3| TRUE    |
| 2         | Shop 2   | Machine 4| TRUE    |
| 2         | Shop 2   | Machine 5| TRUE    |
| 2         | Shop 2   | Machine 6| TRUE    |
| Machine 1 | Machine 1|          |         |
| Machine 2 | Machine 2|          |         |
| Machine 3 | Machine 3|          |         |
| Machine 4 | Machine 4|          |         |
| Machine 5 | Machine 5|          |         |
| Machine 6 | Machine 6|          |         |

## DataItems
Data items are all the events within the timeline

| Column Name | Data Type               | Description                                                         |
| ----------- | ----------------------- | ------------------------------------------------------------------- |
| id          | Unique Single Line Text | Unique identifier                                                   |
| content     | Single Line Text        | Text displayed on the Gantt bars                                    |
| title       | Multi Line Text         | Tooltip items (new lines must be formatted as HTML)                 |
| type        | Single Line Text        | Type of the timeline (built for ranges, other types are untested)   |
| group       | Single Line Text        | Links to the 'id' from the DataGroups table, determines bar's lane  |
| editable    | Boolean (Yes/No)        | Determines if the bar can be edited via the Gantt UI                |
| className   | Single Line Text        | Links to the CSS styling for the Gantt                              |
| start       | DateTime                | Start time of the bar                                               |
| end         | DateTime                | End time of the bar                                                 |

Example data

| className | content        | editable | end                      | group     | id | start                    | title         | type  |
|-----------|----------------|----------|--------------------------|-----------|----|--------------------------|---------------|-------|
| M         | Maintenance(M) | TRUE     | 2024-05-17T22:56:36.958Z | Machine 2 | 1  | 2024-05-17T20:56:36.958Z | line1 \<br> line2 | range |
| S         | Standby (S)    | TRUE     | 2024-05-17T22:56:36.959Z | Machine 3 | 2  | 2024-05-17T20:56:36.959Z | line1 \<br> line2 | range |

## List Items
List items are the draggable objects that can be placed on the Gantt

| Column Name   | Data Type               | Description                                                                 |
| ------------- | ----------------------- | --------------------------------------------------------------------------- |
| id            | Unique Single Line Text | Unique identifier for the list item                                         |
| content       | Single Line Text        | The text that is displayed on the list item                                 |
| type          | Single Line Text        | The type of the timeline (optimized for ranges, other types are untested)   |
| className     | Single Line Text        | The CSS class associated with the list item                                 |
| visClassName  | Single Line Text        | The CSS class applied to the item when it is dropped on the Gantt chart     |
| duration      | Whole Number            | The default duration (in milliseconds) for the item when dropped on the Gantt |
| target        | Single Line Text        | The default target for the list item, typically 'item'                      |

Example data:

| id | content    | type  | className | visClassName | duration | target |
|----|------------|-------|-----------|--------------|----------|--------|
| 1  | Operating  | range | listO     | O            | 3600000  | item   |
| 2  | Idle Time  | range | listIT    | IT           | 3600000  | item   |
| 3  | Standby    | range | listS     | S            | 3600000  | item   |
| 4  | Maintenance| range | listM     | M            | 3600000  | item   |
| 5  | Downtime   | range | listD     | D            | 3600000  | item   |

## Item CSS
This is the formatting for the bars in the Gantt. For example:<br>
.vis-item.O links to the O located within the column className in the dataItems table

```
body,
input {
   font: 12pt verdana;
}

/* gray background for nightshift, white text color */
.vis-time-axis .vis-grid.vis-h18,
.vis-time-axis .vis-grid.vis-h19,
.vis-time-axis .vis-grid.vis-h20,
.vis-time-axis .vis-grid.vis-h21,
.vis-time-axis .vis-grid.vis-h22,
.vis-time-axis .vis-grid.vis-h23,
.vis-time-axis .vis-grid.vis-h0,
.vis-time-axis .vis-grid.vis-h1,
.vis-time-axis .vis-grid.vis-h2,
.vis-time-axis .vis-grid.vis-h3,
.vis-time-axis .vis-grid.vis-h4,
.vis-time-axis .vis-grid.vis-h5 {
   background: rgb(200, 200, 200);
}


.vis-item.vis-selected { /* Selected Item Formatting */
   background-color: white;
   border-color: black;
   color: black;
   box-shadow: 0 0 10px gray;
}

.vis-group-level-unknown-but-gte1 {
   border: 1px solid gray
}

.vis-timeline {
   text-align: left;
}

.vis-ltr .vis-label.vis-nested-group .vis-inner {
   padding-left: 50px;
} /* width of the groups */

/* Bar formatting add more or edit as required */

.vis-item.D {
   background-color: rgb(255, 0, 0);
   border-color: rgb(247, 0, 0);
   color: white;
}

.vis-item.M {
   background-color: rgb(68, 114, 196);
   border-color: rgb(68, 114, 196);
   color: white;
}

.vis-item.O {
   background-color: rgb(112, 173, 71);
   border-color: rgb(112, 173, 71);
   color: white;
}

.vis-item.IT {
   background-color: rgb(255, 192, 0);
   border-color: rgb(255, 192, 0);
   color: white;
}

.vis-item.S {
   background-color: rgb(237, 125, 49);
   border-color: rgb(237, 125, 49);
   color: white;
}
```
## list CSS
This is the formatting in the list of draggable items when creating or editing items in the listItems dataset this should be updated to keep things looking nice.<br>
For the individual items in the CSS you can see there are matching fields in the listItem data table<br>
listItems>className>listO -> .listO
```
.list-items {
    flex: 0 0 auto; /* Use flexbox for layout */
    flex-direction: column; /* Stack children vertically */
    gap: 0.5rem; /* Space between items */
    padding: 1rem; /* Padding inside the container */
    overflow-y: auto; /* Enable vertical scrolling if content overflows */
    border: 1px solid #ccc; /* A subtle border */
    border-radius: 4px; /* Rounded corners */
    background-color: #fff; /* White background */
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* A light shadow for depth */
    max-height: 400px; /* Maximum height before scrolling */
    width: 100px !important;
    
}

#unique-timeline-id {
    /* ... other properties ... */
    flex-grow: 1; /* Grow to take up remaining space */
}

/* Hover effect for list items */
.list-items div:hover {
    opacity: 0.8;
}

/* Styles for the selected item */
.list-items .selected {
    border-color: #f00;
}

/* Specific styles for each item based on className add edit as required*/
.listO {
    background-color: rgb(112, 173, 71);
    /* Light grey background */
    color: white;;
    /* Dark grey text */
    padding: 10px;
    margin-bottom: 5px;
    border: 1px solid rgb(112, 173, 71);
    /* Light grey border */
    cursor: pointer;
}

.listIT {
    background-color: rgb(255, 192, 0);
    color: white;;
    padding: 10px;
    margin-bottom: 5px;
    border: 1px solid rgb(255, 192, 0);
    cursor: pointer;
}

.listS {
    background-color: rgb(237, 125, 49);
    color: white;;
    padding: 10px;
    margin-bottom: 5px;
    border: 1px solid rgb(237, 125, 49);
    cursor: pointer;
}

.listM {
    background-color: rgb(68, 114, 196);
    color: white;;
    padding: 10px;
    margin-bottom: 5px;
    border: 1px solid rgb(68, 114, 196);
    cursor: pointer;
}

.listD {
    background-color: rgb(255, 0, 0);
    color: white;
    padding: 10px;
    margin-bottom: 5px;
    border: 1px solid rgb(255, 0, 0);
    cursor: pointer;
}
```
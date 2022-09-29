## Process Visualizer

A tool for visualizing complex batch processes. 


## Description
This tool is loosly based on ISA 88 Batch control terminalogy. Equipment is added to the model on the equipment screen. Operations can be added to each peice of equipment describing a procedural step. Required resources can be added to each operation. The combined operations create a gantt chart for each equipment which layout the procedure. Multiple batches can be combined into a  campaign and the detail's on the campaign's resource requirements are shown on the resource screen. A summary screen is provided to visualize the bottleneck and equipment occupancy details. 

## Example
A batch process for making cookies:
- Equipment: Mixer
    - Operation: Add incredients
    - Operation: Mix
    - Operation: Place dough balls on baking sheet
 - Euipement: Oven
    -Operation: Preheat
    -Operation: Bake
    

## Screens

Equipment Screen: Visualizes the operations for each equipment and batches. 
Resource Screen: Charts of the consumption of each resource
Summary Screen: Bottleneck and equipment occupancy details

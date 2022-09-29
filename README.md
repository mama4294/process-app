## Process Visualizer

A tool for visualizing complex batch processes. 
![mb-equipment](https://user-images.githubusercontent.com/75315861/193160706-c7e1e52d-05fa-4dfe-b2c5-5e5962c20c22.png)


## Description
This tool is loosly based on ISA 88 Batch control terminalogy. Equipment is added to the model on the equipment screen. Operations can be added to each peice of equipment describing a procedural step. Required resources can be added to each operation. The combined operations create a gantt chart for each equipment which layout the procedure. Multiple batches can be combined into a  campaign and the detail's on the campaign's resource requirements are shown on the resource screen. A summary screen is provided to visualize the bottleneck and equipment occupancy details. 

## Example
A batch process for making cookies:
- Equipment: Mixer
    - Operation: Add ingredients
    - Operation: Mix
        - Resource: 10 kW Electricity
    - Operation: Transfer dough to baking sheet
 - Euipement: Oven
    - Operation: Preheat
        - Resource: 50 kW Electricity
    - Operation: Bake
        - Resource: 20 kW Electricity
    

## Screens

- Equipment Screen: Visualizes the operations for each equipment and batches. 
- Resource Screen: Charts of the consumption of each resource
- Summary Screen: Bottleneck and equipment occupancy details


![mb-editequip](https://user-images.githubusercontent.com/75315861/193160769-5aead1bb-81a0-4972-a0bd-8e3471bfeafc.png)
![mb-resources](https://user-images.githubusercontent.com/75315861/193160776-d2adc5f5-8131-4817-9366-b05f8f8bd1b4.png)
![mb-summary](https://user-images.githubusercontent.com/75315861/193160783-8275edcf-8bac-419e-86c9-412b3ca54665.png)


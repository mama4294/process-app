import styles from "../../styles/EOchart.module.css";
import { useContext, useState} from "react";
import { CampaignContext } from "../../contexts/campaignContext";
import { EquipmentContext } from "../../contexts/equipmentContext";
import { minToFreindlyTime } from "../../utils/helperFunctions";
import Tooltip from "@mui/material/Tooltip";
import Button from "@mui/material/Button";
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import FilterListIcon from '@mui/icons-material/FilterList';
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import { convertToMinutes } from "../../utils/ganttLogic";


export const SummaryPage = ()=>{
    const {batches} = useContext(CampaignContext);
    const {equipment, calcCycleTime} = useContext(EquipmentContext);
    const bottleneck = calcCycleTime();
    const batchTime = minToFreindlyTime(bottleneck.duration)
    const totalTime = minToFreindlyTime(bottleneck.duration*batches.length)
    
    return(
        <div className={styles.container}>
            <div style={{display: "flex", gap: "20px", flexWrap: "wrap"}}>
            <IndicatorCard title="Batch Duration" value={batchTime}/>
            <IndicatorCard title="Number of Batches" value={batches.length}/>
            <IndicatorCard title="Total Duration" value={totalTime}/>
            <IndicatorCard title="Bottleneck" value={bottleneck.title} footerLabel={batchTime}/>
            <EquipmentUtilizationTable equipment={equipment} bottleneckDuration={bottleneck.duration}/>
            </div>
        </div>
    )
}

const IndicatorCard = ({title,value, footerValue, footerLabel}) =>{
    return(
        <Card>
            <div style={{width: "200px"}}>
                <p className={styles.summaryChartTile}>{title}</p>
                <p className={styles.summaryChartValue}>{value}</p>
                <div style={{display:"flex",  marginTop: "2px"}}>
                    <p className={styles.summaryChartFooterValue}>{footerValue}</p>
                    <p className={styles.summaryChartFooterLabel}>{footerLabel}</p>
                </div>
            </div>
        </Card>
    )
}


const EquipmentUtilizationTable = ({equipment, bottleneckDuration}) =>{
    console.log("equipment")
    console.table(equipment)

    const calculateUtilization = ({equipment, bottleneckDuration}) =>{

            // const data = [
    //     {title: "Mixer", utilization: 20},
    //     {title: "Filler", utilization: 60},
    //     {title: "Packaging", utilization: 90},
    // ]

        const calcUtilFromEquip = (operations, bottleneckDuration) =>{
            const minutesUsed = operations.reduce((acc, op)=>{
                return acc + convertToMinutes(op.duration, op.durationUnit)
            },0)
            
            return Math.round(minutesUsed/bottleneckDuration*100)
        }

        if (!equipment) return []
        let data = []
        equipment.map((equip)=>{
            data.push({
                id: equip.id,
                title: equip.title, 
                utilization: calcUtilFromEquip(equip.operations, bottleneckDuration)
            })
        })
        return data

   
    }

    const sortOptions =[
        {title: "none", text: "Sort"},
        {title: "asc", text:"Ascending"},
        {title: "desc", text:"Decending"}]

    const [sortIndex, setSortIndex] = useState(0)

    const cycleFilter = () =>{
        if(sortIndex < 2){
            setSortIndex(prev => prev + 1)
        }else{
            setSortIndex(0)
        }
    }

    const getIcon = (index) => {
        switch (index) {
          case 0:
            return <FilterListIcon />;
          case 1:
            return <KeyboardArrowUpIcon />;
          case 2:
            return <KeyboardArrowDownIcon />;
          default:
            return <FilterListIcon />;
        }
      };



     const data = calculateUtilization({equipment: equipment, bottleneckDuration: bottleneckDuration})
     console.table(data)



    const getSortedData = (data, sortIndex) =>{
        if(sortIndex===1) return data.sort((a,b)=> a.utilization-b.utilization)
        if(sortIndex===2) return data.sort((a,b)=> b.utilization-a.utilization)
        return data
    }

    const sortedData = getSortedData(data, sortIndex)


    return(
        <Card>
            <div style={{display: "flex", alignItems:"center"}}>
            <p className={styles.summaryChartTile}>Equipment Utilization</p>
            <Tooltip title={sortOptions[sortIndex].text}>
                <IconButton onClick={cycleFilter}>
                {getIcon(sortIndex)}
            </IconButton>
        </Tooltip>
            </div>

            <div className={styles.utilizationContainer}>
                <div className={styles.utilizationChart} >   
                {sortedData.map((equip)=>{
                      const listItemStyle = {
                        background: "#red",
                        gridColumn: `1/${equip.utilization}`,
                      };
                    return(
                        <>
                        <div className={styles.chartRowLabel}>
                            {equip.title} 
                        </div>
                        <div className={styles.indicator} >
                        <Tooltip title={`${equip.utilization}%`} placement="top">
                            <div className={styles.bar} style={listItemStyle}/>
                        </Tooltip> 
                         </div>   
                        </>
                    )
                })}           
                </div>
            </div>
        </Card>
    )
}

const Card = ({children}) =>{
    return(
    <Box sx={{ background: "white", p:2, borderRadius: 1, boxShadow: "0 4px 8px 0 rgb(0 0 0 / 20%), 0 6px 20px 0 rgb(0 0 0 / 19%)", flexGrow: 1}}>
     {children}
    </Box>
    )
}
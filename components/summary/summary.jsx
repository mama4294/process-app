import styles from "../../styles/EOchart.module.css";
import { useContext} from "react";
import { CampaignContext } from "../../contexts/campaignContext";
import { EquipmentContext } from "../../contexts/equipmentContext";
import { minToFreindlyTime } from "../../utils/helperFunctions";
import Box from "@mui/material/Box";


export const SummaryPage = ()=>{
    const {batches} = useContext(CampaignContext);
    const {calcCycleTime} = useContext(EquipmentContext);
    const bottleneck = calcCycleTime();
    const batchTime = minToFreindlyTime(bottleneck.duration)
    const totalTime = minToFreindlyTime(bottleneck.duration*batches.length)
    
    return(
        <div className={styles.container}>
            <div style={{display: "flex", gap: "20px", flexWrap: "wrap"}}>
            <IndicatorCard title="Batch Duration" value={batchTime}/>
            <IndicatorCard title="Number of Batches" value={batches.length}/>
            <IndicatorCard title="Total Duration" value={totalTime}/>
            <IndicatorCard title="Bottleneck" value={bottleneck.title} footerValue={bottleneck.duration} footerLabel="min"/>
            <EquipmentUtilizationTable/>
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


const EquipmentUtilizationTable = () =>{

    const data = [

        {title: "Mixer", utilization: "20%"},
        {title: "Filler", utilization: "60%"},
        {title: "Packaging", utilization: "90%"},
    ]

    return(
        <Card>
            <div className={styles.utilizationContainer}>
                <div className={styles.utilizationChart} >   
                {data.map((equip)=>{
                      const listItemStyle = {
                        background: "#red",
                        gridColumn: `5/100`,
                      };
                    return(
                        <>
                        <div className={styles.chartRowLabel} style={{ marginLeft: "1rem" }}>
                            {equip.title} 
                        </div>
                        <div className={styles.indicator} style={{listItemStyle}}> </div>   
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
    <Box sx={{ background: "white", p:2, borderRadius: 2, boxShadow: "0 4px 8px 0 rgb(0 0 0 / 20%), 0 6px 20px 0 rgb(0 0 0 / 19%)"}}>
     {children}
    </Box>
    )
}
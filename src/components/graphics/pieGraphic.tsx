import {  
  PieChart
} from "react-native-chart-kit";
import { FC, useEffect, useState, useRef } from "react";
import {  
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Modal,
  ScrollView,
  Text
} from "react-native";
import { colores, chartPallete } from "../../utils/colorPallets";
import { useScreenSize } from "../../hooks";

type pieGraphicProps = {
  data: any[]
}

export type dataGraphic = {
    name: string,
    population: number,
    color: string,
    legendFontColor: string,
    legendFontSize: 15
}


export const PieGraphic: FC<pieGraphicProps> = ({data}):JSX.Element => {
  
  const { screenWidth, screenHeight } = useScreenSize();
  const [pieData, setPieData] = useState<any []>(defaultData);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  
  useEffect(() => {
    changeData();
  }, [data])    
  
  const changeData = () => {
    const dataLength = data.length;
    if(!data || dataLength <= 0) return;
    makePieData(data);
  }

  const makePieData = (data: any[]) => {
    //PENDIENTE optimizacion
    const maxInit = 15;
    const prov = data.map( (dataMap, index) => ({...dataMap, state: index < maxInit}));
    setPieData(prov);
  }

  const setAllFilter = (state:boolean) => {
    //change status of all options
    const prov = pieData.map((dataMap) => ({...dataMap, state: state}));
    setPieData(prov);
  }

  const filterData = (data:any, name:string = 'name') => {
    const datos = pieData.map( (datos) => {
      return datos[name] == data ? {...datos, state: !datos.state} : datos
    });
    setPieData(datos);
  }

  const handleViewModal = () => { 
    setIsModalVisible(!isModalVisible);
  }

  return(

    <View style={styles.container}>
      {/* FILTER BUTTON */}
      <TouchableOpacity 
        style={styles.filterContainer}
        activeOpacity={1}
        onPress={handleViewModal}
      >
        <Image
          source={require('../../images/filter-icon.png')}
          style={styles.filterImg}
        />
      </TouchableOpacity>
      <PieChart
        data={pieData.filter( (data) => data.state == true)}
        width={screenWidth - 20}
        height={250}
        chartConfig={chartConf}
        accessor={"population"}
        backgroundColor={'transparent'}
        paddingLeft={"15"}
        avoidFalseZero={true}
        hasLegend={true} //labels
        center={[0, 0]}
        absolute={false}
      />  
      <Modal
        visible={isModalVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={{...modalStyles.container, width: screenWidth, height: screenHeight}}>
          <View style={modalStyles.modalContainer}>
            <View style={modalStyles.modalHeader}>
              <View style={modalStyles.exitContainer}>
                <TouchableOpacity 
                  style={modalStyles.exitButton}
                  onPress={handleViewModal}  
                  activeOpacity={1}
                >
                  <Image
                    source={require('../../images/right.png')}
                    style={modalStyles.exitImage}
                  />
                </TouchableOpacity>
              </View>
              <View style={modalStyles.filterContainer}>
                <TouchableOpacity 
                  style={modalStyles.filterButtons}
                  onPress={() => setAllFilter(true)}  
                  activeOpacity={1}
                >
                  <Image
                    source={require('../../images/check.png')}
                    style={modalStyles.filterCheck}
                  />
                </TouchableOpacity>
                <TouchableOpacity 
                  style={modalStyles.filterButtons}
                  onPress={() => setAllFilter(false)}  
                  activeOpacity={1}
                >
                  <Image
                    source={require('../../images/uncheck.png')}
                    style={modalStyles.filterCheck}
                  />
                </TouchableOpacity>
              </View>
              </View>
            <View style={modalStyles.optionsContainer}>
              <ScrollView
                horizontal={false}
                style={{}}
              >
                {
                  pieData.map( ({name, state}, index) => 
                    (
                      <TouchableOpacity 
                        key={index}
                        activeOpacity={1}
                        onPress={() => filterData(name)}
                        style={{...modalStyles.optionsButton,paddingVertical: 10}}
                      >
                        {
                          state 
                          ?
                          <Image
                            source={require('../../images/check-black.png')} 
                            style={{...modalStyles.optionsIcon}}
                          />
                          :
                          <Image 
                            source={require('../../images/uncheck-black.png')}
                            style={modalStyles.optionsIcon}
                          />
                        }
                        <Text style={modalStyles.optionsText}>{name}</Text>
                      </TouchableOpacity>
                    )
                  )
                }
              </ScrollView>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  )
}

const { blue, bluePink} = chartPallete;
const randomColor = () => bluePink[Math.round(Math.random() * bluePink.length)];

const defaultData: any[] = [{
    name: "Seoul",
    population: 21500000,
    color: "rgba(131, 167, 234, 1)",
    legendFontColor: "#7F7F7F",
    legendFontSize: 15
  },
  {
    name: "Toronto",
    population: 2800000,
    color: "#F00",
    legendFontColor: "#7F7F7F",
    legendFontSize: 15
  },
  {
    name: "Beijing",
    population: 527612,
    color: "red",
    legendFontColor: "#7F7F7F",
    legendFontSize: 15
  },
  {
    name: "New York",
    population: 8538000,
    color: "#F23FA3",
    legendFontColor: "#7F7F7F",
    legendFontSize: 15
  },
  {
    name: "Moscow",
    population: 11920000,
    color: "rgb(0, 0, 255)",
    legendFontColor: "#7F7F7F",
    legendFontSize: 15
  }
];

const chartConf = {
  backgroundGradientFrom: "#1E2923",
  backgroundGradientFromOpacity: 0,
  backgroundGradientTo: "#08130D",
  backgroundGradientToOpacity: 0.5,
  color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
  strokeWidth: 2, // optional, default 3
  barPercentage: 0.5,
  useShadowColorFromDataset: false // optional
}

const styles = StyleSheet.create({
  container: {
    height: 230,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent'
  },
  filterContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: 50,
    width: 50,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1
  },
  filterPress: {
    backgroundColor: 'blue'
  },
  filterImg: {
    height: 25,
    width: 25
  }
});

const modalStyles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  modalContainer: {
    backgroundColor: '#ffff',
    height: 600,
    width: 350,
    borderRadius: 10,
    justifyContent: 'flex-start',
  },
  modalHeader: {
    backgroundColor: colores.primary,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignContent: 'center',
    height: 50,
    borderTopRightRadius: 5,
    borderTopLeftRadius: 5,
  },
  exitContainer: {
    // backgroundColor: 'yellow',
    justifyContent: 'center',
    alignItems: 'flex-start',
    flex: 1,
  },
  exitButton: {
    marginLeft: 5,
    width: 30,
    height: 30,
    // backgroundColor: colores.textSecondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  exitImage: {
    width: 30,
    height: 30,
    transform: [{rotate: '180deg'}]
  },
  filterContainer: {
    flex: 1,
    marginRight: 10,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  filterButtons: {
    marginLeft: 10,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterCheck: {
    width: 30,
    height: 30
  },
  optionsContainer: {
    height: 550,
  },
  optionsButton: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start'
  },
  optionsIcon: {
    width: 20, 
    height: 20,
    marginLeft: 10, 
  },
  optionsText: {
    textAlignVertical: 'center',
    color: colores.textPrimary,
    marginLeft: 10
  }
});
import React, {useState, useEffect} from 'react';
import { Feather as Icon } from '@expo/vector-icons'
import { View,ImageBackground,Text,Image,StyleSheet,KeyboardAvoidingView,Platform } from 'react-native'
import { RectButton } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import RNPickerSelect from 'react-native-picker-select';
import axios from 'axios'

interface UfData{
  sigla: string;
}

interface CityData{
  nome: string;
}

const Home = () => {

  const [uf,setUf] = useState<string[]>([]);
  const [city,setCity] = useState<string[]>([]);

  const [selectedUf,setSelectedUf] = useState('');
  const [selectedCiy,setSelectedCiy] = useState('');

  const navigation = useNavigation();

  useEffect(()=>{
    axios.get<UfData[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados')
    .then(res =>{
      const ufinitials = res.data.map(uf => uf.sigla);
      setUf(ufinitials);
    });
  },[])

  function handleNavigateToPoints(){
    if(!selectedUf || !selectedCiy) return
    navigation.navigate('Points',{
      uf: selectedUf,
      city: selectedCiy,
    })
  }

  function handleUfSelection(value: string){
    setSelectedUf(value);
    
    axios.get<CityData[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${value}/municipios`).then(res => {
      const Cityinitials = res.data.map(city => city.nome);
      setCity(Cityinitials)
    })
  }

  return(
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? 'padding' : undefined }>
      <ImageBackground  
        source={require('../../assets/home-background.png')} 
        style={styles.container}
        imageStyle={{ width: 274 ,height: 368}}
      >
        <View style={styles.main}>
          <Image source={require('../../assets/logo.png')}/>
          <View>
            <Text style={styles.title}>Seu marketplace de coleta de residuos</Text>
            <Text style={styles.description}>Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente</Text>
          </View>
        </View>   

        <View style={styles.footer}>

        <View style={styles.input}>
            <RNPickerSelect 
              onValueChange={value => handleUfSelection(value)}
              style={{ placeholder:{color:"#000" }}}
              placeholder={{ label: 'Selecione seu estado'}}
              items={uf.map(item => {
                return ({
                  label: item,
                  value: item
                });
              })}
            >
            </RNPickerSelect> 
        </View>
        <View style={styles.input}>
            <RNPickerSelect 
              onValueChange={value => setSelectedCiy(value)}
              style={selectedUf ? {placeholder:{color:"#000"}} : {placeholder:{color:"#6C6C80"}} }
              
              placeholder={{ label: 'Selecione sua cidade'}}
              items={city.map(item => {
                return ({
                  label: item,
                  value: item
                });
              })}
            >
            </RNPickerSelect> 
          </View>

          <RectButton style={styles.button} onPress={handleNavigateToPoints}>
            <View style={styles.buttonIcon}>
              <Text>
                <Icon name="arrow-right" color="#fff" size={24} />
              </Text>
            </View>
            <Text style={styles.buttonText}>
              Entrar
            </Text>
          </RectButton>
        </View>   

      </ImageBackground>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
  },

  main: {
    flex: 1,
    justifyContent: 'center',
  },

  title: {
    color: '#322153',
    fontSize: 32,
    fontFamily: 'Ubuntu_700Bold',
    maxWidth: 260,
    marginTop: 64,
  },

  description: {
    color: '#6C6C80',
    fontSize: 16,
    marginTop: 16,
    fontFamily: 'Roboto_400Regular',
    maxWidth: 260,
    lineHeight: 24,
  },

  footer: {},

  select: {},

  input: {
    height: 60,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 16,
    paddingVertical: 5,
    paddingHorizontal: 12,
  },

  button: {
    backgroundColor: '#34CB79',
    height: 60,
    flexDirection: 'row',
    borderRadius: 10,
    overflow: 'hidden',
    alignItems: 'center',
    marginTop: 8,
  },

  buttonIcon: {
    height: 60,
    width: 60,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center'
  },

  buttonText: {
    flex: 1,
    justifyContent: 'center',
    textAlign: 'center',
    color: '#FFF',
    fontFamily: 'Roboto_500Medium',
    fontSize: 16,
  }

});

export default Home;
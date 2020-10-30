import React,{Component, useState} from 'react';
import { Text, 
         View, 
         StyleSheet, 
         Button, 
         Image, 
         TextInput, 
         TouchableOpacity, 
         ActivityIndicator,
         Platform,
         ToastAndroid,
         Alert } from 'react-native';

import Constants from 'expo-constants';

//importações do React Navigation
import { NavigationContainer, DrawerActions, OptionsScreen, useNavigation, useRoute } from '@react-navigation/native';

import { createStackNavigator } from '@react-navigation/stack';

//módulo do Tab Navigator
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

//biblioteca de icones
import { Ionicons, Entypo } from '@expo/vector-icons';

//módulo do Navigation Drawer
import {createDrawerNavigator} from '@react-navigation/drawer';

//importação do contexto do usuário
import {userContext} from './components/userContext'

//uso de Hooks para criação de objetos
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

//header usado somente no login
function LogoSimple() {

  return (
    <View style={styles.titulo}>
      <Text>Doe+</Text>
    </View>
  );
}

//header da home - atualizada com o navigation drawer
function LogoTitle() {
  //objeto de controle de navegação
  const navigation = useNavigation();
  const route = useRoute();

  const {user} = route.params
  const {token} = route.params

  console.log(user)
  console.log(token)

  return (
    <View>
      <View style={{
        flex: 1,
        flexDirection:'row'
      }}>
        <Entypo name="menu" size={30} color="#2c685c" 
          onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}/>       
       
      </View>
      <View style={{justifyContent: 'center', alignSelf: 'center'}}>
        <Text style={{
          textAlign: 'center',
          marginTop: -35,
          fontSize: 15,
          fontFamily: 'sans-serif',
          color: '#2c685c'
          }}>Bem vindo {user}</Text>
      </View>
    </View>
  );
}

//função que retorna stack referente a sobre
function AboutScreen(){
  return(

    <userContext.Consumer>
      {({user,token,nav,changeUser,changeToken,changeNav}) => (

    <Stack.Navigator>
      <Stack.Screen
        name="About"
        options={
          {headerTitle: props => <LogoTitle/>}}>
          {props => 
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>App Doe+</Text>
                <Text>Usuário: {user}</Text>
                <Text>Token: {token}</Text>                
              </View>  
          }
      </Stack.Screen>
    </Stack.Navigator>

      )}
  </userContext.Consumer>
  );
}


//tela inicial
function TelaInicial() {
  //objeto de controle de navegação
  const navigation = useNavigation();
  
  //objeto passado para outra tela
  var obj = {
          nome: 'Aluno',
          sobrenome: 'FIAP'
        };
  
return(
    <View style={styles.busca}>
    <TouchableOpacity onPress={() => navigation.navigate('')}
          style={styles.logout}>      
          <Text style={styles.btnlogout}><Image
          style={{ width: 23, height: 23 }}          
        /></Text>
        </TouchableOpacity>

       <TextInput
      style={styles.input}
      placeholder="Nome"
      autoCorrect={false}
      onChangeText={()=>{}}
      />

      <TouchableOpacity
      style={styles.buscar}>
        <Text style={styles.btnentrartxt}>Buscar</Text>      
      </TouchableOpacity>
      <View style={styles.bg}>      
    </View>
     
    </View>    
  );
}


//tela de detalhes
function TelaDetalhes() {
  //objeto de controle de navegação
  const navigation = useNavigation();

  //recebendo dados da tela anterior


  return(
    <View style={styles.container}>
      <Text style={styles.paragraph}>Minha tela de detalhes</Text>
      <Button
        title='Voltar'
        onPress={() => navigation.goBack()}
      />
    </View>
  );
}

//stacks do App da aula anterior
function AppStack(){
  return(
    <Stack.Navigator>
          
          <Stack.Screen
            name='Home'
            options={{ headerTitle: props => <LogoTitle/> }}>
            {props => <TelaInicial />}
          </Stack.Screen>

          <Stack.Screen
            name='Detalhes'
            options={{title: 'Tela de Detalhes'}}>
            {props => <TelaDetalhes />}
          </Stack.Screen>
        </Stack.Navigator>
  );
}

//renderiza o tab e por sua vez as stacks
function AppTabScreen({routeName}){
  return(
          <Tab.Navigator
          initialRouteName={routeName}
          screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'App') {
              iconName = 'ios-home';
            } 
            
            else if (route.name === 'About') {
              iconName = focused ? 'ios-information-circle' :        'ios-information-circle-outline';
            }

            // Qualquer componente pode ser usado
            return <Ionicons name={iconName} size={size} color={color} />;
          },
        })}
        tabBarOptions={{
          activeTintColor: 'red',
          inactiveTintColor: 'black',
        }}
      >
          <Tab.Screen name="App" component={AppStack}/>
         
          <Tab.Screen name="About" component={AboutScreen}/>

        </Tab.Navigator>
  );
}

function MainScreen(){
  return(
        <Drawer.Navigator initialRouteName="App">
          <Drawer.Screen name="App">
             {props => <AppTabScreen routeName="App"/>} 
          </Drawer.Screen>
         
          <Drawer.Screen name="About">
             {props => <AppTabScreen routeName="About"/>} 
          </Drawer.Screen>
        </Drawer.Navigator>
  );
}

function TelaLogin(){
  
  //hooks de navegação e states para capturar dados de usuário e senha
  const navigation = useNavigation();
  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');
  const [loading,setLoading] = useState(false);

//personaliza renderização da mensagem para o sistema operacional específico
function showMessage(message){
  if(Platform.OS === 'android'){
    ToastAndroid.show(message,ToastAndroid.SHORT)
  }
  else if(Platform.OS === 'ios'){
    Alert.alert("FIAP",message)
  }
  else{
    alert(message)
  }
}

  //verificar credenciais do usuário para acesso à aplicação
 function checkPost(changeUser, changeToken, changeNav){

    //objeto que será passado pelo navigation
    var obj = {
      user: user,
      token: '',
    }

    setLoading(true);
    
    fetch('http://192.168.0.104:5000/api/usuario/login',{
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        Email: user,
        Senha: password,
      }),
    }).then((response)=> {
      response.json().then((result) => {
        //aqui é analisada a resposta

        if(response.status === 200){
          obj.token = result['token']

          //atualizando o contexto
          changeUser(user)
          changeToken(result['token'])
          changeNav(navigation)

          navigation.navigate('Main',obj)
        }
        else{
          console.log(result)
          showMessage(result['error'])
        }

        setLoading(false);

      }
      )
    }).catch(function(error){
      console.log('There has been a problem with your fetch operation: ' + error.message);
      throw error;
    })
  }

  return(
    <userContext.Consumer>
      {({user,token,nav,changeUser,changeToken,changeNav}) => (
      
      <View style={styles.container}>
     <View style={styles.img}>
        <Image
          style={{ width: 150, height: 150 }}
          source={require('./images/Logo_DoeMais-01.png')}
        />
      </View>
        
        <TextInput
          autoCorrect={false}
          placeholder="Usuario"
          clearButtonMode={"while-editing"}
          style={styles.textInput}
          onChangeText={(value) => setUser(value)}/>       

        <TextInput
          autoCorrect={false}
          secureTextEntry={true}
          placeholder="Senha"
          clearButtonMode={"while-editing"}
          style={styles.textInput}
          onChangeText={(value) => setPassword(value)}/>

        <TouchableOpacity
          style={styles.paragraph}
          onPress={() => checkPost(changeUser, changeToken, changeNav)}>
          <View style={styles.btnentrar}>
            {loading
              ? <ActivityIndicator size='small' color='white'/>
              : <Text style={styles.btnentrartxt}>Entrar</Text>
            }
          </View>
           <View style={styles.botoes}>

          <TouchableOpacity onPress={() => navigation.navigate('Cadastro')}
          style={styles.btncadastrar}>      
          <Text style={styles.btncadastrartxt}>Não possui uma conta ?</Text>
          <Text style={styles.btncadastrartxt2}>Cadastrar</Text>
        </TouchableOpacity>
      </View>
        </TouchableOpacity>
  
    </View>

    )}
  </userContext.Consumer>
  );
}
//tela de detalhes
function Cadastro(){
  
var obj = {
    nome: 'Usuario',
    sobrenome: 'FIAP'
  }

  //chamada do objeto para gerir a navegação
  const navigation = useNavigation();
  
  return(
    <View>
       <TextInput
      style={styles.input}
      placeholder="Nome"
      autoCorrect={false}
      onChangeText={()=>{}}
      />

      <TextInput
      style={styles.input}
      placeholder="E-mail"
      autoCorrect={false}
      onChangeText={()=>{}}
      />

      <TextInput
      style={styles.input}
      placeholder="RG"
      autoCorrect={false}
      onChangeText={()=>{}}
      />

      <TextInput
      style={styles.input}
      placeholder="CPF"
      autoCorrect={false}
      onChangeText={()=>{}}
      />

      <TextInput
      style={styles.input}
      placeholder="Especialidade"
      autoCorrect={false}
      onChangeText={()=>{}}
      />

      <TextInput
      style={styles.input}
      placeholder="CRM"
      autoCorrect={false}
      onChangeText={()=>{}}
      />

     <TouchableOpacity  onPress={() => cadastrar(changeUser, changeToken, changeNav)}
          style={styles.btnentrar}>      
          <Text style={styles.btnentrartxt}>Cadastrar</Text>
        </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.goBack()}
          style={styles.btnvoltar}>      
          <Text style={styles.btnentrartxt}>←</Text>
        </TouchableOpacity>
    
    </View>
  );

  function checkPost(changeUser, changeToken, changeNav){

    //objeto que será passado pelo navigation
    var obj = {
      user: user,
      token: '',
    }

    setLoading(true);
    
    fetch('http://192.168.0.104:5000/api/usuario/login',{
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        Email: user,
        Senha: password,
      }),
    }).then((response)=> {
      response.json().then((result) => {
        //aqui é analisada a resposta

        if(response.status === 200){
          obj.token = result['token']

          //atualizando o contexto
          changeUser(user)
          changeToken(result['token'])
          changeNav(navigation)

          navigation.navigate('Main',obj)
        }
        else{
          console.log(result)
          showMessage(result['error'])
        }

        setLoading(false);

      }
      )
    }).catch(function(error){
      console.log('There has been a problem with your fetch operation: ' + error.message);
      throw error;
    })
  }

}

//renderiza o navigation drawer
class App extends Component {
  
  //state referente a dados do contexto do usuário
  constructor(props){
    super(props)

    this.state = {
      userName: 'username',
      token: 'token',
      navigation: null
    }

    this.setUser = this.setUser.bind(this);
    this.setToken = this.setToken.bind(this);
    this.setNav = this.setNav.bind(this);

  }

  setUser(usr){
    this.setState({userName: usr})
  }

  setToken(tk){
    this.setState({token: tk})
  }

  setNav(nav){
    this.setState({navigation: nav})
  }
  
  render(){

    const loginValue = {
      user: this.state.userName,
      token: this.state.token,
      nav: this.state.navigation,
      changeUser: this.setUser,
      changeToken:this.setToken,
      changeNav: this.setNav
    }

    return ( 

      <userContext.Provider value={loginValue}>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Login">
            <Stack.Screen
              name="Login"
              options={{headerTitle: props => <LogoSimple/>}}>
              {props => <TelaLogin/>}
            </Stack.Screen>
            <Stack.Screen
              name="Main"
              options={{headerTitle: props => <LogoTitle/>, headerLeft: null}}>
              {props => <MainScreen/>}
            </Stack.Screen>
            <Stack.Screen
            name='Cadastro'
            style={styles.tituloCadastro}
            options={{title: 'Cadastre-se'}}>
            {props => <Cadastro/>}
          </Stack.Screen>
          </Stack.Navigator>
        </NavigationContainer>
      </userContext.Provider>
      
  );
  }
} export default App

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#ecf0f1',
    padding: 8,
  },
  paragraph: {
    margin: 24,
    
    fontWeight: 'bold',
    textAlign: 'left',
  },
  textInput:{
    width: '90%',
    height: 35,
    padding: 5,
    marginLeft: '5%',
    marginTop: 10
  },  
  titulo:{
    flex: 1,
    color: '#2c685c',
    fontFamily: 'sans-serif',
    alignItems: 'center',    
       
  },
    img: {
    marginTop: 40,
    alignItems: 'center',
  },
  btnentrar:{
    backgroundColor: '#2c685c',
    color: '#fff',
    width: '40%',
    height: 35,
    alignItems: 'center',
    justifyContent: 'center',
    
    marginTop: 25,
    marginLeft: '30%',
},
  btnentrartxt: {
    color: '#fff',

   
  },
  btncadastrar: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30
  },

  btncadastrartxt: {
    color: '#2c685c',
    fontFamily: 'sans-serif',
    fontWeight: 'bold',
  
  },
  btncadastrartxt2: {
    color: '#2c685c',
    fontFamily: 'sans-serif',
    fontWeight: 'bold',
   
  },
  input:{
  width: '90%',
  marginLeft: '5%',
  padding: 5,
  
  
  marginTop: 20,
},
 btnvoltar:{
    backgroundColor: '#2c685c',
    color: '#fff',
    width: '10%',
    height: 35,
    alignItems: 'center',
    justifyContent: 'center',
    
    marginTop: 30,
    marginLeft: '5%',
  },
  buscar:{
   backgroundColor: '#2c685c',
    color: '#fff',
    width: '30%',
    height: 35,
    alignItems: 'center',
    justifyContent: 'center',
    
    marginTop: 25,
    marginLeft: '5%', 
 },
 bg:{
   alignItems: 'center',
   marginTop: 10,
   
 },
 btnlogout:{
    color: '#fff',
    fontFamily: 'sans-serif',
    
    marginTop: 15,
    marginLeft: 15
 },
 tituloCadastro:{
   textAlign: 'center'
 }
});

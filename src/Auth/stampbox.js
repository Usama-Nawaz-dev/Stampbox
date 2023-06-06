import React, { useContext, useState } from 'react';
import {
  Alert,
  Image,
  Keyboard,
  Text,
  TextInput,ScrollView,
  TouchableOpacity,
  View,Pressable,FlatList
} from 'react-native';
import AuthContext from '../Context/AuthContext';

const data = [
    {
        name:'Shafqat Shah',
        plan : 'Business Plan',
        follow :true,
        image:require('../assets/icons/apple.png')
    },
    {
        name:'Shafqat Shah',
        plan : 'Business Plan',
        follow :false,
        image:require('../assets/icons/apple.png')
    },
    {
        name:'Shafqat Shah',
        plan : 'Business Plan',
        follow :true,
        image:require('../assets/icons/apple.png')
    },
    {
        name:'Shafqat Shah',
        plan : 'Business Plan',
        follow :true,
        image:require('../assets/icons/apple.png')
    }
]

export default function stampbox() {



    const{myState:{language}}= useContext(AuthContext);

    const renderItem = ({item}) =>{
        return (
            <View style={{width:'90%',alignSelf:'center',margin:10,padding:10}} >
                <View style={{flex:1,flexDirection:'row',alignItems:'center'}} >
                    <View style={{flex:0.15}} >
                        <Image
                            source={item.image}
                            style={{width:35,height:35,backgroundColor:'grey',borderRadius:30}}
                        />
                    </View>
                    <View style={{flex:0.8,marginLeft:10}} >
                        <Text>{item.name}</Text>
                        <View style={{flexDirection:'row',alignItems:'center',marginTop:4}} >
                            <Image
                                source={item.image}
                                style={{width:15,height:15,backgroundColor:'yellow',borderRadius:30}}
                            />
                            <Text style={{marginLeft:5}} >{item.plan}</Text>
                        </View>
                        <View style={{flexDirection:'row',alignItems:'center',marginTop:4}} >
                        <Image
                                source={require('../assets/icons/star.png')}
                                style={{width:15,height:15,borderRadius:30}}
                            />
                            <Image
                                source={require('../assets/icons/star.png')}
                                style={{width:15,height:15,marginLeft:5,borderRadius:30}}
                            />
                            <Image
                                source={require('../assets/icons/star.png')}
                                style={{width:15,height:15,marginLeft:5,borderRadius:30}}
                            />
                            <Image
                                source={require('../assets/icons/star.png')}
                                style={{width:15,marginLeft:5,height:15,borderRadius:30}}
                            />

                            <Image
                                source={require('../assets/icons/star.png')}
                                style={{width:15,height:15,marginLeft:5,sborderRadius:30}}
                            />
                        </View>
                    </View>
                    <View style={{flex:0.3,alignItems:'center'}} >
                            <View style={{width:'95%',alignItems:'center',justifyContent:'center',height:45,borderWidth:1,borderRadius:50,borderColor:'#a0a0a0'}} >
                                    <Text style={{fontWeight:'600'}} >{language?.follow}</Text>
                            </View>
                    </View>
                </View>
            </View>

        )
    }

  return (
    <View style={{flex:1,marginTop:30}} >
        <View style={{}} >
            <Text style={{paddingLeft:25,fontSize:26,fontWeight:'bold'}} >Follow People</Text>
            <View style={{width:'90%',alignSelf:'center',marginTop:20,alignItems:'center',height:52,flexDirection:'row',borderWidth:0.5,borderColor:'#a0a0a0',borderRadius:35}} >
                    <Image
                        source={require('../assets/icons/map.png')}
                        style={{width:20,height:20,marginLeft:10}}
                    />
                    <TextInput
                        style={{width:'84%',marginLeft:10,height:40}}
                    />
            </View>
            <FlatList
                style={{height:'78%'}}
                data={data}
                keyExtractor={item => item.id}
                renderItem={renderItem}
            />
        </View>
        <TouchableOpacity style={{alignSelf:'flex-end',marginTop:10,paddingRight:20}} >
            <Text style={{fontSize:20,fontWeight:'600'}} >{language?.next}{"  -->"}</Text>
        </TouchableOpacity>    
    </View>
  )
}

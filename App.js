import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity } from 'react-native';
import MapView, { Polyline } from 'react-native-maps';
import axios from 'axios';
import Picker from '@react-native-picker/picker';


export default App = () => {
  const [data, setData] = useState([]);
  const [selectedBusStops, setSelectedBusStops] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [route, setRoute] = useState([]);

  const [selectedValue, setSelectedValue] = useState("")

  const [routeName, setRouteName] = useState('');
  const [routeId, setRouteId] = useState('');

  useEffect(() => {
    console.log("RUNNING");
    // axios.get('http://localhost:9000/api/busstops').then((res) => setData(res.data.result)).catch((error) => console.log(error));
  }, []);

  function onSelect(e) {

    setSelectedBusStops([...selectedBusStops, e]);
  }

  function addRoute() {
    axios.get('http://localhost:9000/api/busstops').then((res) => {
      const allStops = res.data.result;
      const filteredStops = allStops.filter((route) => selectedBusStops.includes(route.busStopName));
      const newArr = [];
      setRoutes(filteredStops);
      routes.map((e) =>
        newArr.push({
          latitude: e.busStopCoord[0],
          longitude: e.busStopCoord[1],
        })
      );
      setRoute(newArr);
      console.log(route);
      console.log(routes);
    });
  }

  function onAdd() {
    axios
      .post('http://localhost:9000/api/busroutes/create', {
        busRouteName: routeName,
        busStopDetails: routes,
        busRouteId: routeId,
      })
      .then((res) => {
        console.log(res);
      });
  }

  const center = {
    latitude: 47.90771,
    longitude: 106.88324,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

  return (
    <View>
      <TextInput

        placeholder="Чиглэлийн дугаар"
        value={routeName}
        onChangeText={(text) => setRouteName(text)}
      />
      <TextInput

        placeholder="Чиглэлийн нэр"
        value={routeId}
        onChangeText={(text) => setRouteId(text)}
      />
      <Text>Чиглэлийн буудлуудыг сонгох:</Text>

      {/* <Picker selectedValue={selectedValue} onValueChange={(item) => { console.log(item); onSelect() }}>
        {data.map((e, i) => {
          return (

            <Picker.Item key={i} value={e.busStopName} label={e.busStopName}>

            </Picker.Item>


          );
        })}
      </Picker> */}
      <Text>Сонгогдсон буудлууд:</Text>
      <View >
        {selectedBusStops.map((e, i) => (
          <View key={i}>
            <Text >{e}</Text>
          </View>
        ))}
      </View>
      <TouchableOpacity onPress={() => addRoute()}>
        <Text >Чиглэлийг газрын зураг дээр харах</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => onAdd()}>
        <Text>Чиглэлийг нэмэх</Text>
      </TouchableOpacity>
      <MapView style={{ width: '100%', height: '70%' }} initialRegion={center} >
        {route.length > 0 && (
          <Polyline coordinates={route} strokeWidth={3} strokeColor="#FF0000" />
        )}
      </MapView>
    </View>
  )
}


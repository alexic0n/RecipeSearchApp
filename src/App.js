import React, {Component} from "react";
import getGreeting from './getGreeting.js';
import getStyle from './getStyle.js';
import './App.css';
import './material_input.css'
import * as firebase from "firebase";
import "firebase/auth";
import "firebase/firestore";
import firebaseConfig from "./firebase.config";

firebase.initializeApp(firebaseConfig);

export const AuthContext = React.createContext(null);

class App extends Component {
  constructor () {
    super()
    this.state = {
        keywords: "",
        ingredients: "",
        showresults: false,
        pageno: 0,
        logged: false,
        email : "",
        password:"",
        resultsready: false,
        showingred: false,
        openingred:-1,
        results: "",
        recsready: false,
        recs:""
    }
    this.handleChange = this.handleChange.bind(this)
  }
  handleChange(event) {
    const {name,value, type, checked} = event.target
    if (type === "checkbox"){
      this.setState({
        [name]:checked
      })
    } else {
      this.setState({
        [name]:value
      })
    }
  }
  getRecCards(){
    if(this.state.logged){
      console.log(firebase.auth().currentUser.uid)
      this.getHttpRecommendations(firebase.auth().currentUser.uid)
      if(this.state.recsready){
        console.log(this.state.recs)
        return (
          <div className="rec_but">
            <button className="a_3" >Chocolate Mousse!</button>
            <button className="a_3" >Fresh Pancakes!</button>
            <button className="a_3" >Strawberry Roulade!</button>
          </div>
        )
      }else{
        return (
          <div className="rec_but">
            <button className="a_3" onClick={()=>{this.setState({recsready:true})}}>Loading your recommendations now!</button>
          </div>
        )
      }
    }else{
      return (
        <h3>Please log in to view a custom recommendation feed.</h3>
      )
    }
  }
  getHttpResults(){
    const Http = new XMLHttpRequest();
    var body = "keywords="+this.state.keywords+"&ingredients="+this.state.ingredients+"&vegan="+this.state.vegan;
    const url='https://52.56.196.110:5050/get_results?'+body;
    Http.open("GET", url);
    Http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    console.log(body);
    Http.send();
    Http.onreadystatechange = (e) => {
      if (Http.responseText === ""){
        console.log("error")
      }else{
        this.setState({resultsready:true, results:Http.responseText});
        this.forceUpdate();
      }
    }
  }
  
  getHttpRecommendations(uid){
    const Http = new XMLHttpRequest();
    var body = "uid="+uid;
    const url='https://52.56.196.110:5050/get_recommendations?'+body;
    Http.open("GET", url);
    Http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    console.log(body);
    Http.send();
    Http.onreadystatechange = (e) => {
      if (Http.responseText === ""){
        console.log("error")
      }else{
        this.setState({recsready:true, recs:Http.responseText});
        this.forceUpdate();
      }
    }
  }

  postUID(uid,recipeid){
    const Http = new XMLHttpRequest();
    var body = "uid="+uid+"&recipeid="+recipeid;
    const url = 'https://52.56.196.110:5050/post_uid?'+body;
    Http.open("POST",url);
    Http.send()
  }
  resetState(){
    this.setState(
      {resultsready:false,
      results:"",
      keywords:"",
      ingredients:"",
      showresults:false,
      showingred:false,
      pageno:0,
      openingred:-1,
      recsready: false,
      recs:""
      }
    );
  }
  getIngredients(){
    var myJ = JSON.parse(this.state.results);
    var which = this.state.openingred;
    const items = [];
    for (var i = 0; i<myJ[which].Ingredients.length; i++){
      items.push(<a key={i} href={myJ[which].Ingredients[i].Link}><li>{myJ[which].Ingredients[i].Name}</li></a>)
    }
    return [items,myJ[which].ID,myJ[which].Name];
  }

  getContent(){
    if (this.state.showresults === false){
      return(
        <div>
          <header className="App-header">
            <div>
              {getGreeting()}
            </div>
            <div>
              <div className="group">      
                <input name="keywords" type="text" onChange={this.handleChange}/>
                <span className="highlight"></span>
                <span className="bar"></span>
                <label className="input_label">Keywords</label>
              </div>
              <div className="group">      
                <input name="ingredients" type="text" onChange={this.handleChange}/>
                <span className="highlight"></span>
                <span className="bar"></span>
                <label className="input_label">Ingredients</label>
              </div>
              <div className="button_cont" align="center" >
                <button className="example_a" onClick={()=>{this.setState({showresults:true}); this.getHttpResults();}}>
                  Find some recipes!
                </button>
              </div>
            </div>
          </header>
          <div className="rec">
            {this.getRecCards()}
          </div>
        </div>
      )
    } else if (this.state.resultsready === false || this.state.results === ""){
      this.getHttpResults();
      return (
        <header className="App-header">
          <p className="introPara">Getting your results now...</p>
        </header>
      )
    } else if (!this.state.showingred){
      var myJ = JSON.parse(this.state.results);
      return (
        <header className="App-header">
          <div className="resultscreen">
            <div>
              <p className="introParaLite">Search Results</p>
            </div>
            <div className="fiveResults">
              <div className="resultDiv" onClick={()=>{this.expandedResults(0);}}>
                <p>{myJ[0].Name}</p>
              </div>
              <br/>
              <div className="resultDiv" onClick={()=>{this.expandedResults(1);}}>
                <p>{myJ[1].Name}</p>
              </div>
              <br/>
              <div className="resultDiv" onClick={()=>{this.expandedResults(2);}}>
                <p>{myJ[2].Name}</p>
              </div>
              <br/>
              <div className="resultDiv" onClick={()=>{this.expandedResults(3);}}>
                <p>{myJ[3].Name}</p>
              </div>
              <br/>
              <div className="resultDiv" onClick={()=>{this.expandedResults(4);}}>
                <p>{myJ[4].Name}</p>
              </div>
            </div>
            <div className="button_cont" align="center" >
              <button className="example_a" onClick={()=>{this.resetState();}}>
                Make another search!
              </button>
            </div>
          </div>
        </header>
      )
    } else if (this.state.showingred) {
      var [items,ID,Name] = this.getIngredients();
      if(this.state.logged){
        var uid = firebase.auth().currentUser.uid;
        this.postUID(uid,ID);
      }
      return(
        <header className="App-header">
          <div className="resultscreen">
            <div>
              <a href={"https://www.food.com/"+ID}><p className="introParaLite">{Name}</p></a>
            </div>
          </div>
          <div className="ingredients">
            {items}
          </div>
          <div className="button_cont" align="center" >
            <button className="example_a" onClick={()=>{this.setState({showingred:false});}}>
              Back to Results!
            </button>
          </div>
        </header>
      )
    }
  }
  expandedResults(resultNumber){
    this.setState({showingred:true,openingred:resultNumber});
  }

  tryLogin(){
    firebase.auth().signInWithEmailAndPassword(this.state.email,this.state.password).then(() => {
      this.setState({logged:true,password:""});
    }).catch(function(error){
      alert(error.message);
    });
  }
  trySignup(){
    firebase.auth().createUserWithEmailAndPassword(this.state.email,this.state.password).then(() => {
      this.setState({logged:true,password:""});
    }).catch(function(error){
      alert(error.message);
    });
  }
  trySignOut(){
    firebase.auth().signOut().then(() => {
      this.setState({logged:false,email:"",password:""});
    }).catch(function(error) {
      alert(error.message);
    });
  }
  getNavbar(){
    if (this.state.logged === false){
      return (
        <div className="topnav">
          <div className="login-container">
            <input className="navbarinput" type="text" placeholder="Email" name="email" onChange={this.handleChange}/>
            <input className="navbarinput" type="text" placeholder="Password" name="password" onChange={this.handleChange}/>
            <button className="navbarbutton" onClick={()=>{this.tryLogin()}}>Login</button>
            <button className="navbarbutton" onClick={()=>{this.trySignup()}}>Signup</button>
          </div>
        </div>
      )
    }else{
      return (
        <div className="topnav">
          <div className="login-container">
            <h3>Welcome to Scraping the Barrel, {this.state.email}.</h3>
            <button className="navbarbutton" onClick={()=>{this.trySignOut()}}>Logout</button>
          </div>
        </div>
      )
    }
  }
  myStyle = getStyle();
  render(){
    return (
      <div>
        <div id="loginBar">
          {this.getNavbar()}
        </div>
        <div style={this.myStyle}>
          {this.getContent()}
        </div>
      </div>
    );
  }
}

export default App

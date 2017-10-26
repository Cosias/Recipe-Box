import React, { Component } from 'react';
import './App.css';
import Accordion from 'react-bootstrap/lib/Accordion'
import Panel from 'react-bootstrap/lib/Panel'
import Button from 'react-bootstrap/lib/Button'
import ButtonToolbar from 'react-bootstrap/lib/ButtonToolbar'
import Modal from 'react-bootstrap/lib/Modal'
import FormGroup from 'react-bootstrap/lib/FormGroup'
import ControlLabel from 'react-bootstrap/lib/ControlLabel'
import FormControl from 'react-bootstrap/lib/FormControl'


class App extends Component {

  state={
    recipes:[],
    showAdd: false,
    showEdit: false,
    currentIndex: 0,
    newestRecipe:{recipeName:'', ingredients:[]}
  }

// Delete recipe from the list of recipes
  deleteRecipe(index){
    let recipes= this.state.recipes.slice();
    recipes.splice(index, 1);
    localStorage.setItem('recipes',JSON.stringify(recipes));
    this.setState({recipes});
  }

// Sets the newest recipe created
  updateNewRecipe(recipeName, ingredients){
    this.setState({newestRecipe:{recipeName: recipeName, ingredients: ingredients}});
  }

// Closes Modal
  close = () =>{
    if(this.state.showAdd){
      this.setState({showAdd: false});
    }
    else if(this.state.showEdit){
      this.setState({showEdit: false});
    }
  } 

// Opens Modal
  open = (state, currentIndex)=>{
    this.setState({[state]: true});
    this.setState({currentIndex});
    console.log(this.state.showAdd);
  }

//Save a new recipe to the list of recipes
  saveNewRecipe = ()=>{
    let recipes = this.state.recipes.slice();

    if(/\S/.test(this.state.newestRecipe.recipeName)){
      recipes.push({recipeName: this.state.newestRecipe.recipeName,
       ingredients: this.state.newestRecipe.ingredients});
    }
    
    localStorage.setItem('recipes', JSON.stringify(recipes));
    this.setState({recipes});
    this.setState({newestRecipe: {recipeName:'', ingredients:[]}})
    this.close();
  }

// Updates the name of a recipe
  updateRecipeName = (recipeName,currentIndex)=>{
    let recipes = this.state.recipes.slice();
    recipes[currentIndex] = {recipeName: recipeName, ingredients: recipes[currentIndex].ingredients};
    localStorage.setItem('recipes', JSON.stringify(recipes));
    this.setState({recipes});
  }

// Updates the ingredients in a recipe
  updateIngredients = (ingredients, currentIndex) =>{
    let recipes = this.state.recipes.slice();
    recipes[currentIndex] = {recipeName:recipes[currentIndex].recipeName, ingredients: ingredients};
    localStorage.setItem('recipes', JSON.stringify(recipes));
    this.setState({recipes});
  }

  componentDidMount = ()=>{
    let recipes = JSON.parse(localStorage.getItem('recipes'))|| [];
    this.setState({recipes});
  }

  render() {
    const {recipes, newestRecipe, currentIndex} = this.state;
    return (
      <div className = 'container'>
      <div id='title'><h1>Recipe Box</h1></div>
      <div className="App container text-center">
       
        {recipes.length > 0 &&(
          <div>
            <Accordion>
              {recipes.map((recipe,index)=>(
                <Panel className = 'recipe' header={recipe.recipeName} eventKey = {index} key = {index}>
                  <ul>
                    {recipe.ingredients.map((item)=>(
                      <li key={item}>{item}</li>
                      ))}
                  </ul> 

                  <ButtonToolbar>
                    <Button bsStyle ='danger' onClick={(event)=>this.deleteRecipe(index)}>Delete Recipe</Button>
                    <Button bsStyle ='default' onClick={(event)=>this.open('showEdit', index)}>Edit Recipe</Button>
                  </ButtonToolbar>
                </Panel>
             ))}
            </Accordion>
        
            <Modal show={this.state.showEdit} onHide={this.close}>
              <Modal.Header closeButton>
                <Modal.Title>Edit Recipe</Modal.Title>
                <Modal.Body>

                  <FormGroup controlId='formBasicText'>
                    <ControlLabel>Recipe Name</ControlLabel>
                    <FormControl 
                    type='text'
                    value={recipes[currentIndex].recipeName}
                    placeholder='Enter Recipe Name'
                    onChange = {(event)=> this.updateRecipeName(event.target.value, currentIndex)}
                    ></FormControl>
                  </FormGroup>

                  <FormGroup controlId='formControlsTextArea'>
                    <ControlLabel>Ingredients</ControlLabel>
                    <FormControl 
                    type='textarea'
                    placeholder='Enter Ingredients (Seperate By Commas)' value={recipes[currentIndex].ingredients}
                    onChange = {(event)=> this.updateIngredients(event.target.value.split(','),currentIndex)}     
                    ></FormControl>
                  </FormGroup>
                </Modal.Body>
                
                <Modal.Footer>
                  <Button onClick={(event)=>this.close()}>Close</Button>
                </Modal.Footer>
              </Modal.Header>
            </Modal>          

          </div>
        
            )}
        
        
        <Modal show={this.state.showAdd} onHide={this.close}>
          <Modal.Header closeButton>
            <Modal.Title>Add Recipe</Modal.Title>
            <Modal.Body>
              <FormGroup controlId='formBasicText'>
                <ControlLabel>Recipe Name</ControlLabel>
                <FormControl 
                type='text'
                value={newestRecipe.recipeName}
                placeholder='Enter Recipe Name'
                onChange = {(event)=> this.updateNewRecipe(event.target.value, newestRecipe.ingredients)}
                ></FormControl>
              </FormGroup>

              <FormGroup controlId='formControlsTextArea'>
                <ControlLabel>Ingredients</ControlLabel>
                <FormControl 
                type='textarea'
                value={newestRecipe.ingredients}
                placeholder='Enter Ingredients (Seperate By Commas)'
                onChange = {(event)=> this.updateNewRecipe(newestRecipe.recipeName, event.target.value.split(','))}
                
                ></FormControl>
              </FormGroup>

            </Modal.Body>
            <Modal.Footer>
              <Button onClick={(event)=>this.saveNewRecipe()}>Save Recipe</Button>
            </Modal.Footer>
          </Modal.Header>
        </Modal>

        <Button bsStyle ='primary' className = 'addBtn' onClick={(event)=>this.open('showAdd', currentIndex)}>Add Recipe</Button>
      
      </div>
      </div>
    );
  }
}

export default App;

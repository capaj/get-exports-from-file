import React, {Component} from 'React'

class ShoppingList extends Component {
  render () {
    return <div className='shopping-list'>
      <h1>Shopping List for {this.props.name}</h1>
      <ul>
        <li>Instagram</li>
        <li>WhatsApp</li>
        <li>Oculus</li>
      </ul>
    </div>
  }
}
const statelessComponentNotExported = (props) => <div>just a sample</div> //eslint-disable-line

export const statelessComponent = (props) => { return <div>just a sample</div> }

export default ShoppingList

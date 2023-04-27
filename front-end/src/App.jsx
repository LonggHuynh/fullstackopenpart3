import Filter from './components/Filter'
import Notification from './components/Notification'
import Person from './components/Person'
import PersonForm from './components/PersonForm'
import { useEffect, useState } from 'react'
import { getPersons, addPerson, deletePerson, updatePerson, } from './services'

const App = () => {
  const [notification, setNotification] = useState(undefined);
  const [success, setSuccess] = useState(true);

  const notify = (msg, success) => {
    setNotification(msg);
    setSuccess(success);
    setTimeout(() => {
      setNotification();
    }, 5000);
  };


  const [persons, setPersons] = useState([])



  const [val, setVal] = useState(false)

  const forceUpdate = () => { setVal(prev => !prev); }

  useEffect(() => {


    getPersons().then((data) => setPersons(data))
      .catch(err => { notify(err.response.data.msg, false) })
  }, [val])


  const [filteredPersons, setFilteredPersons] = useState(persons)


  const deleteOldPerson = (person) => {
    if (window.confirm(` Do you want to delete ${person.name}`)) {
      deletePerson(person.id)
        .then(() => notify(`${person.name} is  deleted`, true))
        .catch(err => { notify(err.response.data.msg, false) })
        .finally(() => forceUpdate())
    }
  }

  const addNewPerson = (person) => {
    addPerson(person)
      .then(() => notify(`${person.name} is  added`, true))
      .catch(err => { notify(err.response.data.msg, false) })
      .finally(() => forceUpdate())

  }

  const updateOldPerson = (person) => {
    updatePerson(person)
      .then(() => notify(`${person.name} is  updated`, true))
      .catch(err => { notify(err.response.data.msg, false) })
      .finally(() => forceUpdate())
  }

  return (
    <div>

      {notification && (
        <Notification message={notification} success={success} />
      )}
      <h2>Phonebook</h2>

      <Filter persons={persons} setPersons={setPersons} setFilteredPersons={setFilteredPersons} />

      <h3>Add a new</h3>

      <PersonForm persons={persons} addNewPerson={addNewPerson} updateOldPerson={updateOldPerson} />

      <h3>Numbers</h3>
      {
        filteredPersons.map(person => <Person key={person.id} person={person} deleteOldPerson={() => deleteOldPerson(person)} />)
      }
    </div>
  )
}


export default App
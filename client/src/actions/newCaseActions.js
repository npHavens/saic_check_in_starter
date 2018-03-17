import axios from 'axios';

/*** Action Creators ***/
const editSubject = (data) => {
  return {type: 'EDIT_SUBJECT', subject: data};
}

const update = (data) => {
  return {type: 'UPDATE', updating: data};
}

/*** newCase Actions ***/

const handleEdit = (event) => (dispatch, getState) => {
  dispatch(editSubject(event.target.value));
}

const toggleUpdating = (args) => (dispatch, getState) => {
  const updating = getState().newCase.updating;
  dispatch(update(!updating));
}

export {handleEdit, toggleUpdating};
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import AccountInfo from '../components/AccountInfo.jsx';
import NewCase from '../components/NewCase.jsx';
import * as newCaseActions from '../src/actions/newCaseActions.js';
import Cases from './Cases.js';

const Account = ({ contact, newCaseActions, caseActions, newCase }) => {
  return (
      <div>
        <AccountInfo {...contact}/>
        <NewCase
          id={contact.EMPLIDPeoplesoftKey__c}
          { ...newCase }
          { ...newCaseActions }
        />
        <Cases/>
      </div>
    );
}

const mapStateToProps = (state) => {
  return state;
};

const mapDispatchToProps = (dispatch) => {
  return {
    newCaseActions: bindActionCreators(newCaseActions, dispatch)
  };
};


export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Account);
import React from 'react';

export default (props) => 
  <div class="box" onClick={props.onClick}>
    {props.value}
  </div>;
  
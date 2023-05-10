import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import Accordion from 'react-bootstrap/Accordion';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import TextField from '@mui/material/TextField';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import SellIcon from '@mui/icons-material/Sell';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import BeenhereIcon from '@mui/icons-material/Beenhere';
import {hashRandom } from 'react-hash-string'
import './AddImageTagDialog.css'
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import Checkbox from '@mui/material/Checkbox';
import { Box } from '@mui/material';
import {  toast } from 'react-toastify';
import { Avatar } from "@nextui-org/react";
import * as APILib from "../../libs/APIAccessAndVerification"
import * as variables from "../../variables/variables"
const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});


function sleep(delay = 0) {
  return new Promise((resolve) => {
    setTimeout(resolve, delay);
  });
}
export default function MentionDialog({SetShowAddMentionDialog,appendText,RemoveMentionedUserText}) {

  //----------------------------------------NOTE:Mention Comp variables-------------------------------------------------//

  //This variable contains All the users that you can mention
  const [ListOfMentionableUsers,setListOfMentionableUsers]=React.useState([])
  //This variable contains the selected users that we want to mention
  const [ListOfMentionedUsers,setListOfMentionedUsers]=React.useState([])


  //----------------------------------------------NOTE:Mention Comp Variables END----------------------------------------//



    //----------------------------------------NOTE:Mention Comp Functions-------------------------------------------------//
  
    //This function closes the dialog by calling the caller component and updating a state
  const handleClose = () => {
    SetShowAddMentionDialog(false)
  };

  //This function saves the selected users into a global variable which will be used later on by the post to associate the mentions
  const HandleMentionedUserSelection=((MentionedUsers)=>{
    setListOfMentionedUsers(MentionedUsers)
  })

  const HandleAddMention = () => {

    let TempMentionList=[]
    //Reformating the mention objects
    ListOfMentionedUsers.map((mention)=>{
      let mentionObj={MentionedUserID:mention.UserID,MentionText:"@"+mention.Name.replaceAll(" ",""),Preview_Name:mention.Name}
      TempMentionList=[...TempMentionList,mentionObj]
    })

    //Removing the removed mentioned users tags
    //ListOfRemovedMentionedUsers is a variable that contains all the users that got removed, this is needed so that we know how to update the editor
    var ListOfRemovedMentionedUsers=variables.PostGlobalVariables.POST_Mentions.filter((MentionedUserOld)=>!TempMentionList.some((MentionedUserNew)=>MentionedUserNew.MentionedUserID==MentionedUserOld.MentionedUserID))
    //Removing all the mentions that needs to be removed from the editor
    ListOfRemovedMentionedUsers.map((UserToRemove)=>{
      //Calling a function from the parent component to access the editor and remove the @tag
      RemoveMentionedUserText(UserToRemove.MentionText)
    })
    var ListOfNewlyAddedMentionedUsers=TempMentionList.filter((MentionedUserNew)=>!variables.PostGlobalVariables.POST_Mentions.some((MentionedUserOld)=>MentionedUserNew.MentionedUserID==MentionedUserOld.MentionedUserID))
    //Adding the mention tags to the editor for all the newly added mentions
    ListOfNewlyAddedMentionedUsers.map((mention)=>{
      appendText(mention.MentionText)
    })

    //Saving them to the global variable
    variables.PostGlobalVariables.POST_Mentions=TempMentionList

  };

  //----------------------------------------------NOTE:Mention Comp Functions END----------------------------------------//


  //----------------------------------------NOTE:Mention Comp intialization-------------------------------------------------//


  //Getting the mentionable Platform accounts from the backened
  React.useEffect(()=>{

    var JsonObject = {};
    let JsonObjectToSend = JSON.stringify(JsonObject);
    let url2 =process.env.REACT_APP_BACKENDURL + process.env.REACT_APP_GETMENTIONABLEPLATFORMACCOUNTS;
    let UserToken = window.localStorage.getItem("AuthToken");
    let APIResult = APILib.CALL_API_With_JWTToken(url2, JsonObjectToSend, UserToken);
    APIResult.then((response) => {
      if (response.errorCode == undefined) {
        if(response.successCode=="MentionablePlatformAccounts_fetched!")
        {
          let Temp_AccList=[]
          response.result.map((Acc)=>{
            Temp_AccList=[...Temp_AccList,{UserID:Acc.platformAccountID,Name:Acc.cachedData_Name,imgurl:Acc.cachedData_PictureURL}]
            setListOfMentionableUsers(Temp_AccList)
          })

          //Setting default values based on the global mention variable
           let Temp_MentionedUsers=[]
          variables.PostGlobalVariables.POST_Mentions.map((MentiondUser)=>{

            Temp_AccList.map((mentionableUser)=>{
              if(MentiondUser.MentionedUserID==mentionableUser.UserID)
              {
                Temp_MentionedUsers=[...Temp_MentionedUsers,mentionableUser]
              }
            })
            

          })

          setListOfMentionedUsers(Temp_MentionedUsers)
           
        }
      }
        
    })

    

  },[])

  //----------------------------------------------NOTE:Mention Comp intialization END----------------------------------------//
  return (
    <div>
      <Dialog
        
        open={true}
        fullWidth={true}
        maxWidth='lg'
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>Post Mentions</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
      <Container>
        <Row>
          <Col md={12}>
     
          <Autocomplete
          onChange={(event, newValue)=>{
            HandleMentionedUserSelection(newValue)
          }}
          value={ListOfMentionedUsers}
          key={"MultiPageSelect"}
          multiple
          id="checkboxes-tags-demo"
          options={ListOfMentionableUsers}
          disableCloseOnSelect
          getOptionLabel={(option) => option.Name}
          renderOption={(props, option, { selected }) => {
            return(
              <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
            
              <Checkbox
                icon={icon}
                checkedIcon={checkedIcon}
                style={{ marginRight: 8 }}
                checked={selected}
              />


          <img
            loading="lazy"
            width="20"
            src={option.imgurl}
            srcSet={option.imgurl}
            alt=""
          />
          {option.Name}          
            </Box>
          )}}
          style={{ width: "auto" }}
          renderInput={(params) => (
            <TextField {...params} placeholder="Select The people you want to mention" />
          )}
          />

          </Col>
          
        </Row>
      </Container>

    
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={HandleAddMention}>Save Mentioned People List</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}


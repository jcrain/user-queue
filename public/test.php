
  
<?php 


/* ********** POST SUBMITTED DATA TO LUMINATE SURVEY ********** */
    /* form has submitted to self, process inputs and POST to Luminate UI */

    //form inputs
    $firstname = $argv[1];
    $lastname = "";
    $email = $argv[2];
    $surveyid = "1721";
    
    //environment response
    $successresponse = "success";
    $errorresponse = "error";

    //submits to actual survey in order to avoid need for auth token or SSO
    $surveyurl = "http://events.coloncancerchallenge.org/site/Survey";
    $userinputs = "cons_first_name=".$firstname."&cons_last_name=".$lastname."&cons_email=".$email;
    //denysubmit should be left blank, it is a firstline anti-spam dummy input in the original UI
    $surveyinputs = "SURVEY_ID=".$surveyid."&cons_info_component=t&denySubmit=&ACTION_SUBMIT_SURVEY_RESPONSE=Submit&NEXTURL=PageServer%3Fpagename%3Dcolonotron_mockapiresponse%26resp%3D".$successresponse."%26pgwrap%3Dn&ERRORURL=PageServer%3Fpagename%3Dcolonotron_mockapiresponse%26resp%3D".$errorresponse."%26pgwrap%3Dn";

    $postvars = $userinputs."&".$surveyinputs;

    $ch = curl_init( $surveyurl );
    curl_setopt( $ch, CURLOPT_POST, 1);
    curl_setopt( $ch, CURLOPT_POSTFIELDS, $postvars);
    curl_setopt( $ch, CURLOPT_FOLLOWLOCATION, 1);
    curl_setopt( $ch, CURLOPT_HEADER, 0);
    curl_setopt( $ch, CURLOPT_RETURNTRANSFER, 1);

    $response = curl_exec( $ch );

    echo $response;

/* ********** END POST SUBMIT ********** */



/* present self-submitting form to collect data in test scenerio */
?>
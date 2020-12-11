import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as apidaze from 'apidaze-js';

@Component({
  selector: 'app-folder',
  templateUrl: './folder.page.html',
  styleUrls: ['./folder.page.scss'],
})
export class FolderPage implements OnInit {
  public folder: string;
  public number = "14847844455";
  public active = false;
  callObj;
  constructor(private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.folder = this.activatedRoute.snapshot.paramMap.get('id');
  }
  call(){
    this.initAPIdazeCLIENT();
  }
  initAPIdazeCLIENT() {

    const appId = 'dummy-app-id';
    const server = 'DO-US1'; //Keep DO-US1 as a default server for apidaze
    const wsurl = 'wss://fs-us-sf-1.apidaze.io:8082';

    const APIdazeClientObj = new apidaze.CLIENT({
      type: 'webrtc',
      apiKey: '9ceed852',
      wsurl: wsurl,
      debug: true,
      onReady: function () {
        this.active = true;
        this.callObj = APIdazeClientObj.call({
          callerid: '14123468480',
          phone_number: this.number,
          grandstream: appId,
          command: 'placecall',
          webrtc: true
        },
          {
            onRinging: function () {
              console.log('Call ringing');
              this.setSinkIdByIndex(0);
            }.bind(this),
            onAnswer: function () {
              this.onAnswered();
            }.bind(this),
            onHangup: function (event) {
              this.onHangup();
            }.bind(this)
          });
      }.bind(this),
      onDisconnected: function () {
        console.log('Call failed');
      }
    });
  }
  onAnswered(){
    console.log("call answered.");
  }
  onHangup(){
    this.active = false;
    console.log("call hung up.");
  }
  hangup(){
    this.callObj.hangup();
  }
}

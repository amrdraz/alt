var SceneModel = DS.Model.extend({
  name: DS.attr('string'),
  lesson: DS.belongsTo('lesson', {inverse:'scenes'}),
  content: DS.attr('string'),
  interaction: DS.belongsTo('interaction', {inverse:'scene'}),
  
  // pointers are interactions that lead to this scene
  // pointers: DS.hasMany('interaction', {async:true,inverse:'nextScene'}),
  // reactions: DS.hasMany('reaction')
  // interactionChange:function () {
  //    console.log("observing",this);
  //    console.log(this.get('interaction.id'));
  //  }.observes('interaction')
});

var content=[
'<span id="docs-internal-guid-b3adafe1-f390-0e84-4136-7fe98728774e"><br><span style="font-size: 16px; font-family: Calibri; color: rgb(0, 0, 0); font-weight: bold; text-decoration-line: underline; vertical-align: baseline; white-space: pre-wrap;"></span></span><p dir="rtl" style="line-height: 1.1500000000000001; margin-top: 0pt; margin-bottom: 10pt; text-align: right;"><span style="font-size: 16px; font-family: Calibri; color: rgb(0, 0, 0); vertical-align: baseline; white-space: pre-wrap;">ة</span><img src="https://lh6.googleusercontent.com/v5AiiQv6fT4oxSLIyu81ZtJxxGicRnoVLTTqeiP39E6FORVKZdm-BTGzXMvd5TUrT8lrJWHGSHX6KPIcH0VfSWDOfz24hpXQ8hbU7eUIGD2P7dTgvDFN9Le-_ently8akt7ooNQ" width="291px;" height="212px;" style="line-height: 1.1500000000000001; border: none; -webkit-transform: rotate(0rad);"><br></p><p dir="rtl" style="line-height: 1.1500000000000001; margin-top: 0pt; margin-bottom: 10pt; text-align: right;"><span style="font-size: 16px; font-family: Calibri; color: rgb(0, 0, 0); vertical-align: baseline; white-space: pre-wrap;"></span></p><span id="docs-internal-guid-b3adafe1-f390-0e84-4136-7fe98728774e"></span><p dir="rtl" style="margin-top: 0pt; margin-bottom: 10pt; line-height: 1.1500000000000001; text-align: right;"><span style="font-size: 16px; font-family: Calibri; color: rgb(0, 0, 0); vertical-align: baseline; white-space: pre-wrap;">١٣.٨ مليون طن مخلفات منزلي</span></p><p dir="rtl" style="line-height: 1.1500000000000001; margin-top: 0pt; margin-bottom: 10pt; text-align: right;"><span style="font-size: 16px; font-family: Calibri; color: rgb(0, 0, 0); vertical-align: baseline; white-space: pre-wrap;"><span id="sceditor-start-marker" class="sceditor-selection sceditor-ignore" style="line-height: 0; display: none;"> </span><span id="sceditor-end-marker" class="sceditor-selection sceditor-ignore" style="line-height: 0; display: none;"> </span>٣٨ ألف طن في اليوم</span></p><span id="docs-internal-guid-b3adafe1-f390-0e84-4136-7fe98728774e"></span><p dir="rtl" style="line-height: 1.1500000000000001; margin-top: 0pt; margin-bottom: 10pt; text-align: right;"><span style="font-size: 16px; font-family: Calibri; color: rgb(0, 0, 0); vertical-align: baseline; white-space: pre-wrap;">١٧٣ كيلو قمامة من كل شخص في العام</span></p><span id="docs-internal-guid-b3adafe1-f390-0e84-4136-7fe98728774e"></span><p dir="rtl" style="line-height: 1.1500000000000001; margin-top: 0pt; margin-bottom: 10pt; text-align: right;"><span style="font-size: 16px; font-family: Calibri; color: rgb(0, 0, 0); vertical-align: baseline; white-space: pre-wrap;">٥٠٠ جرام قمامة من كل شخص كل يوم</span></p><span id="docs-internal-guid-b3adafe1-f390-0e84-4136-7fe98728774e"><br><span style="font-size: 16px; font-family: Calibri; color: rgb(0, 0, 0); vertical-align: baseline; white-space: pre-wrap;"></span><br><span style="font-size: 16px; font-family: Calibri; color: rgb(0, 0, 0); vertical-align: baseline; white-space: pre-wrap;"></span><br><span style="font-size: 16px; font-family: Calibri; color: rgb(0, 0, 0); vertical-align: baseline; white-space: pre-wrap;"></span></span>',
'<span id="docs-internal-guid-b3adafe1-f390-0e84-4136-7fe98728774e"><span id="docs-internal-guid-b3adafe1-f39a-7451-7f9f-a13ab3508f60"><br></span></span><div style="text-align: center;"><span id="sceditor-start-marker" class="sceditor-selection sceditor-ignore" style="line-height: 0; display: none;"> </span><img src="https://lh6.googleusercontent.com/VZSq5qX-1EAbaB7NNWX1duDiux5LwKEbEy8kT2tjYIRhaYIIDKRi_8u59DtWQLQJi3OhanR9aj4O9ZBUtnfT_dal6EaRDfljTqsIHd-HCXrR58kMNCiv5QzpHQASJQ" width="401px;" height="455px;" style="border: none; -webkit-transform: rotate(0rad);"><span id="sceditor-end-marker" class="sceditor-selection sceditor-ignore" style="line-height: 0; display: none;"> </span></div><span id="docs-internal-guid-b3adafe1-f390-0e84-4136-7fe98728774e"><span id="docs-internal-guid-b3adafe1-f39a-7451-7f9f-a13ab3508f60"><span style="font-size: 16px; font-family: Calibri; color: rgb(0, 0, 0); vertical-align: baseline; white-space: pre-wrap;"></span><span style="font-size: 16px; font-family: Calibri; color: rgb(0, 0, 0); font-weight: bold; text-decoration-line: underline; vertical-align: baseline; white-space: pre-wrap;"></span></span></span><p dir="rtl" style="line-height: 1.1500000000000001; margin-top: 0pt; margin-bottom: 10pt; text-align: right;"><br></p><span id="docs-internal-guid-b3adafe1-f390-0e84-4136-7fe98728774e"><span id="docs-internal-guid-b3adafe1-f39a-7451-7f9f-a13ab3508f60"></span><span style="font-size: 16px; font-family: Calibri; color: rgb(0, 0, 0); vertical-align: baseline; white-space: pre-wrap;"></span></span>',
'<div style="text-align: center;"><span id="sceditor-start-marker" class="sceditor-selection sceditor-ignore" style="line-height: 0; display: none;"> </span><span id="sceditor-end-marker" class="sceditor-selection sceditor-ignore" style="line-height: 0; display: none;"> </span><iframe width="560" height="315" src="http://www.youtube.com/embed/YknKtGIhFCo?wmode=opaque" data-youtube-id="YknKtGIhFCo" frameborder="0" allowfullscreen=""></iframe></div><span id="docs-internal-guid-b3adafe1-f390-0e84-4136-7fe98728774e"><span style="font-size: 16px; font-family: Calibri; color: rgb(0, 0, 0); vertical-align: baseline; white-space: pre-wrap;"></span></span>'
];


SceneModel.FIXTURES = [
    {
        id:1,
        name: "Scene 1",
        content:content[0],
        lesson: 1,
        interaction:1
    },
    {
        id:2,
        name: "Scene 2",
        content:content[1],
        lesson: 1,
        interaction:2
    },
    {
        id:4,
        name: "Scene 3",
        content: content[2],
        lesson: 1,
        interaction:null
    },
    {
        id:5,
        name: "The End",
        content:content[1],
        lesson: 1,
        interaction:null
    },
     {
        id:3,
        name: "Scene 1",
        lesson: 2,
        interaction:null
    }
];

module.exports =  SceneModel;
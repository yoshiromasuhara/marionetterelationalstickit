"use strict";

//テスト用のデータ
var sample_data = {
    account:{id:"account1",name:"取引先１",tel:"xxx-xxx-xxxx"},
    contact:[
        {id:"contact1",name:"担当者１",tel:"xxx-xxx-xxx1",account_id:"account1"},
        {id:"contact2",name:"担当者２",tel:"xxx-xxx-xxx2",account_id:"account1"},
        {id:"contact3",name:"担当者３",tel:"xxx-xxx-xxx3",account_id:"account1"},
        {id:"contact4",name:"担当者４",tel:"xxx-xxx-xxx4",account_id:"account1"},
        {id:"contact5",name:"担当者５",tel:"xxx-xxx-xxx5",account_id:"account1"}
    ]
};

//アプリケーション情報
var SampleApp = new Backbone.Marionette.Application();

//リージョンセット
SampleApp.addRegions({
    account:"#account_wrap",
    contact:"#contact_wrap",
    action:"#action_wrap"
});

//取引先モデル／ビュー
var Account_Model = Backbone.RelationalModel.extend({
    relations: [{
        type: Backbone.HasMany,
        key: 'id',
        relatedModel: 'Contact_Model',
        collectionType: 'Contact_Collection',
        reverseRelation: {
            key: 'account_id'
        }
    }]
});

var Account_View = Backbone.Marionette.ItemView.extend({
    model:Account_Model,
    bindings: {
        "input#name": "name",
        "input#tel": "tel",
    },
    tagName:"dl",
    className:"account ",
    template:"#tmpl_account",
    onRender:function(){
        this.stickit();
    },
});

//担当者モデル／コレクション／ビュー
var Contact_Model = Backbone.RelationalModel.extend({});
var Contact_Collection = Backbone.Collection.extend({
    model: Contact_Model
});

var ContactRow_View = Backbone.Marionette.ItemView.extend({
    bindings: {
        "input.name": "name",
        "input.tel": "tel",
    },
    tagName:"tr",
    template:"#tmpl_contactrow",
    onRender:function(){
        this.stickit();
    }
});

var Contact_View = Backbone.Marionette.CompositeView.extend({
    itemView:ContactRow_View,
    itemViewContainer:"tbody",
    template:"#tmpl_contact"
});

//更新するボタンビュー（親モデルとなる取引先を受け取る）
var Action_View = Backbone.Marionette.ItemView.extend({
    template:"#tmpl_action",
    events:{
        "click #save ":"save"
    },
    save:function(){
        console.log(this.model.toJSON());
    }
});

//初期描画処理
SampleApp.addInitializer(function(data){
    //取引先
    var account_model = new Account_Model(data.account);
    this.account.show(new Account_View({model:account_model}));

    //担当者
    var contact_collection = new Contact_Collection(data.contact);
    this.contact.show(new Contact_View({collection:contact_collection}));

    //更新するボタン
    this.action.show(new Action_View({model:account_model}));
});

//処理開始
SampleApp.start(sample_data);


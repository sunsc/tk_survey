import React from 'react';
import PropTypes from 'prop-types'; // ES6
import $ from 'jquery';

let config = require(`./../../../config/${process.env.NODE_ENV}`);

import getCookie from './../../../lib/getCookie';

class CancelUser extends React.Component {
    constructor() {
        super();
        this.state = {
            alertClass: null,
            alertMessage: null
        };
    }
    // 将微信号与学生账号绑定
    handleCancel(event) {
        event.preventDefault();
        let api_url, wx_openid;
        
        if (process.env.DEV) {
            //@TODO: 在开发模式下，暂时不需要有绑定用户的功能
        }
        else {
            api_url = config.API_DOMAIN + config.API_UNBIND_USER;
            wx_openid = process.env.TEST ? config.TEST_WECHAT_OPENID : getCookie('wx_openid');
            
            var data = {
                'user_name': event.target.userId.value, // 测试学校ID
                'wx_openid': wx_openid
            };
            $.post(api_url, data, function (response, status) {
                    this.setState({
                        alertClass: 'alert-success',
                        alertMessage: '成功解除账号！正在为您跳转。'
                    });
                    setTimeout(function () {
                        this.context.router.push('/');
                    }.bind(this), 1000);
                }.bind(this),
                'json')
                .fail(function (response, status) {
                    this.setState({
                        alertClass: 'alert-danger',
                        alertMessage: $.parseJSON(response.responseText).message
                    });
                }.bind(this));
        }
    }
    
    render() {
        let users;
        if (this.props.hasBindedUser === null) {
            users = <tr><td>老师列表加载中...</td></tr>;
        }
        if (this.props.hasBindedUser === true) {
            console.log(this.props.bindedUsers);
            let username;
            users = this.props.bindedUsers.map((bindedUser,index) => {
                if(bindedUser.role == 'guest'){
                    username = '默认用户';
                }
                else {
                    username = bindedUser.name;
                }
                return <tr key={index}>
                            <td>{username}</td>
                            <td>
                                <form onSubmit={this.handleCancel.bind(this)}>
                                    <input type="hidden" value={bindedUser.user_name} name="userId"/>
                                    <button className="btn btn-danger" type="submit">解除</button>
                                </form>
                            </td>
                        </tr>;
            });
        }
        if (this.props.hasBindedUser === false) {
            users = <tr><td>暂无绑定账号</td></tr>;
        }

        let alert_class = 'alert';
        let alert_message;
        let alert;
        if (this.state.alertClass !== null && this.state.alertMessage !== null) {
            alert_class = alert_class + ' ' + this.state.alertClass;
            alert_message = this.state.alertMessage;
            alert = <div className={alert_class} role="alert">{alert_message}</div>
        }

        return (
            <div className="table-responsive">
                {alert}
                <table className="table">
                    <tbody>
                    {users}
                    </tbody>
                </table>
            </div>
        )
    }
}

CancelUser.contextTypes = {
    router: PropTypes.object.isRequired
};

export default CancelUser;
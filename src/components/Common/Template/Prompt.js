/*
 * @Author: strick
 * @Date: 2021-01-14 14:02:47
 * @LastEditTime: 2021-02-02 14:19:05
 * @LastEditors: strick
 * @Description: 提示组件
 * @FilePath: /strick/shin-admin/src/components/Common/Template/Prompt.js
 */
import { Alert } from 'antd';
function Prompt(props) {
    /**
     * message：标题
     * description：描述
     * showIcon：图标是否显示
     * Alert组件：https://3x.ant.design/components/alert-cn/
     */
    const {message, description, showIcon=true} = props;
    return <Alert
        style = {{ marginBottom:20 }}
        message = {message}
        description = {description}
        type = "info"
        showIcon = {showIcon}
    />;
}
export default Prompt;
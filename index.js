import React, {Component} from 'react';
import {
    View,
    StatusBar,
    StyleSheet,
    Dimensions,
    Text,
    TextInput,
    TouchableWithoutFeedback,
    TouchableOpacity,
    Image,
    Picker,
    Platform
} from 'react-native';

import {TextInputMask} from 'react-native-masked-text';
import Button from '../components/Button';
const {height} = Dimensions.get('window');
import DeviceInfo from 'react-native-device-info';

import i18n from '../i18n';
import config from '../../config';
const logo = config.publicUrl + 'logo.png';
const codeCountryFrance = '+33';
const isTablet = /iPad|^iPhone [3-4]/i.test(DeviceInfo.getModel());

export default class AutorizationScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            phone: '',
            code: '',
            active: true,
            smsOut: false,
            isFrance: true,
            placeholder: '07-12-34-56-78'
        };

        this.numberHandler = this.numberHandler.bind(this);
        this.onInputChange = this.onInputChange.bind(this);
    }

    onPress() {
        if (!this.state.code) {
            this.setState({active: false, smsOut: true});
            let phone = this.state.phone;
            if (this.state.isFrance) {
                phone = phone.substring(1)
            }
            return (this.props.onSendPhonePress({phone}))
        }

        let phone = this.state.phone;
        if (this.state.isFrance) phone = codeCountryFrance + this.state.phone.substring(1);
        this.props.onSendCodePress({code: this.state.code, phone}).then(() => {
            this.navigator && this.navigator.navigate('home');
        });
    }

    numberHandler() {

        let regexp = /^0[6-7]\d{8}$|^[6-7]\d{8}$/;
        let phone = this.state.phone;

        if (this.state.isFrance && regexp.test(phone)) {

            return (
                <Button
                    active={true}
                    title={i18n('welcome.submit')}
                    customEvent={() => this.onPress()}
                />
            );
        }

        if (!this.state.isFrance && phone.length > 10) {

            return (
                <Button
                    active={true}
                    title={i18n('welcome.submit')}
                    customEvent={() => this.onPress()}
                />
            );
        }

        return (
            <Button active={false} title={i18n('welcome.submit')}/>
        );

    }

    onRenderFlag() {
        const flag = {
            flexDirection: 'row',
            width: 20,
            height: 13,
            borderWidth: 0.5,
            borderColor: '#ccc',
            marginRight: 5,
            marginTop: 3
        };

        const otherText = {
            color: '#5F5E7D',
            fontSize: 14,
            lineHeight: 16,
            textAlign: 'center'
        };

        if (this.state.isFrance) {

            return (
                <View style={flag}>
                    <View style={{backgroundColor: 'blue', flex: 1}} />
                    <View style={{backgroundColor: 'white', flex: 1}}/>
                    <View style={{backgroundColor: 'red', flex: 1}}/>
                </View>
            )
        }

        return (
            <View>
                <Text style={otherText}>Other</Text>
            </View>
        )
    }

    onInputChange(rawInputData) {

        rawInputData = this.refs['inputFrancePattern'].getRawValue().replace(/-/g, '');
        this.setState({phone: rawInputData})
    }


    render() {
        return (
            <TouchableWithoutFeedback>

                <View style={styles.mainLayout}>

                    <View style={isTablet ? styles.mainLogoTab : styles.mainLogo}>
                        <Image source={{uri: logo}} style={{width: 140, height: 140, backgroundColor: 'white'}}/>
                    </View>

                    <View style={{flexGrow: 1}}>
                        <View>
                            <Text style={styles.headerText}>{i18n('welcome.title')}</Text>

                            <View style={isTablet ? styles.fieldTab : styles.field}>
                                <Text style={styles.inputLabel}>{i18n('welcome.phone.label')}</Text>


                                <View
                                    style={{flexDirection: 'row', paddingRight: 5, paddingLeft: 5, overflow: 'hidden'}}>

                                    <TouchableOpacity onPress={(isFrance) =>
                                        this.setState({
                                            isFrance: !this.state.isFrance,
                                            placeholder: !this.state.isFrance ? '07-12-34-56-78' : '+10712345678'
                                        })
                                    }
                                    >
                                        <View style={styles.prefixInput}>

                                            {this.onRenderFlag()}

                                        </View>
                                    </TouchableOpacity>
                                    {this.state.isFrance ? (
                                        <View style={styles.phoneInputView}>
                                            <TextInputMask
                                                type={'custom'}
                                                options={{
                                                    mask: '99-99-99-99-99'
                                                }}
                                                ref={'inputFrancePattern'}
                                                style={[styles.phoneInput, {flex: 5}, {textAlign: 'left'}]}
                                                value={this.state.phone}
                                                keyboardType="phone-pad"
                                                onChangeText={this.onInputChange}
                                                placeholder={this.state.placeholder}
                                                placeholderTextColor={'#C7C7CC'}
                                                placeholderStyle={{fontSize: 20}}
                                                underlineColorAndroid={'#EAEAEA'}
                                            />
                                        </View>
                                    ) : (
                                        <View style={styles.phoneInputView}>
                                            <TextInput
                                                style={[styles.phoneInput, {flex: 5}, {textAlign: 'left'}]}
                                                value={this.state.phone}
                                                keyboardType="phone-pad"
                                                onChangeText={(text) => this.setState({phone: text})}
                                                placeholder={this.state.placeholder}
                                                placeholderTextColor={'#C7C7CC'}
                                                placeholderStyle={{fontSize: 20}}
                                                underlineColorAndroid={'#EAEAEA'}
                                            />
                                        </View>
                                    )}
                                </View>

                            </View>

                            <View style={isTablet ? styles.fieldCodeTab : styles.fieldCode}>
                                <Text style={styles.inputLabelCode}>{i18n('welcome.code.label')}: </Text>
                                <TextInput
                                    value={this.state.code}
                                    style={[styles.codeInput, {textAlign: 'center'}]}
                                    keyboardType="numeric"
                                    controlled={true}
                                    onChangeText={text => this.setState({code: text})}
                                    underlineColorAndroid={'#EAEAEA'}
                                />

                                {!this.state.smsOut ? (
                                    <Text
                                        style={styles.inputLabelCodeBottom}>{i18n('authorisation.inputLabelCode')}</Text>
                                ) : (
                                    <View style={{flex: 1}}>
                                        <Text
                                            style={styles.inputLabelCodeBottom}>{i18n('authorisation.inputLabelCodeRoad')}</Text>
                                        <TouchableOpacity onPress={() => this.onPress()}>
                                            <Text
                                                style={styles.inputLabelLink}>{i18n('authorisation.inputLabelCodeReturn')}</Text>
                                        </TouchableOpacity>
                                    </View>
                                )}
                            </View>


                        </View>

                    </View>

                    <View>
                        {!this.state.active && this.state.code.length < 4 ? (
                            <Button
                                active={false}
                                title={i18n('button.go')}
                            />
                        ) : this.state.code.length > 3 ? (
                            <Button
                                active={true}
                                title={i18n('button.go')}
                                customEvent={() => this.onPress()}
                            />
                        ) : this.numberHandler()
                        }
                    </View>

                </View>
            </TouchableWithoutFeedback>
        )
    }
}

const getHeightForFontSize = (fontSize) => {
    return Math.round(fontSize * 2.2)
};

const styles = StyleSheet.create({
    headerWrapper: {
        flex: 0
    },
    mainLayout: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
        backgroundColor: 'rgb(249, 249, 249)',
        height: (Platform.OS === 'ios') ? height : height - 20,
        paddingRight: 10,
        paddingLeft: 10
    },
    mainLogo: {
        justifyContent: 'center',
        flexDirection: 'row',
        marginBottom: 30,
        marginTop: (Platform.OS === 'ios') ? 40 : 20
    },
    mainLogoTab: {
        justifyContent: 'center',
        flexDirection: 'row',
        marginBottom: 10,
        marginTop: 30
    },
    containerAvoid: {
        flex: 1,
        justifyContent: 'flex-start',
        paddingHorizontal: 8,
        paddingTop: 15
    },
    phoneCode: {
        fontFamily: 'OpenSans',
        fontWeight: 'bold',
        color: 'black',
        fontSize: 20,
        marginTop: 8,
        marginRight: 10
    },
    headerText: {
        textAlign: 'center',
        color: '#FF4F00',
        fontFamily: 'OpenSans',
        fontSize: 28,
        lineHeight: 34
        // marginBottom: 30
    },
    field: {
        marginTop: 40,
        // borderWidth: 1
    },
    fieldTab: {
        marginTop: 10,
    },
    fieldCode: {
        marginTop: 25
    },
    fieldCodeTab: {
        marginTop: 10
    },
    inputWrapper: {
        flex: 1,
        flexDirection: 'row'
    },
    labelText: {
        textAlign: 'center',
        color: '#ffffff',
        fontFamily: 'OpenSans',
        fontSize: 25,
        padding: 5,
        borderRadius: 10
    },
    prefixInput: {
        flex: 1,
        minWidth: 90,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#E0E0E0',
        paddingHorizontal: 10,
        height: getHeightForFontSize(26),
        borderTopLeftRadius: 12,
        borderBottomLeftRadius: 12,
        paddingLeft: 25,
        paddingRight: 20
    },
    phoneInput: {
        color: '#666',
        fontFamily: 'OpenSans',
        fontSize: 24,

    },
    phoneInputView: {
        borderColor: '#EFEFF4',
        backgroundColor: '#EAEAEA',
        borderTopRightRadius: 12,
        borderBottomRightRadius: 12,
        paddingHorizontal: 10,
        height: getHeightForFontSize(26),
        paddingLeft: 20,
        flex: 1
    },
    codeInput: {
        color: '#666',
        fontFamily: 'OpenSans',
        fontSize: 16,
        borderColor: '#EFEFF4',
        borderWidth: 1,
        backgroundColor: '#EAEAEA',
        borderRadius: 10,
        marginHorizontal: 30,
        paddingVertical: 0,
        paddingHorizontal: 10,
        height: getHeightForFontSize(18)
    },
    buttonWrapper: {
        padding: 5,
        backgroundColor: '#FE5000',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 10,
        flex: 0,
        marginHorizontal: 5,
        marginVertical: 20,
        borderColor: '#FE5000'
    },
    buttonWrapperDisabled: {
        padding: 5,
        backgroundColor: '#757575',
        alignItems: 'center',
        borderRadius: 10,
        flex: 0,
        marginHorizontal: 5,
        marginVertical: 20
    },
    logoWrapper: {
        alignItems: 'center'
    },
    rocket: {
        backgroundColor: '#FE5000',
        borderRadius: 500,
        padding: 30
    },
    inputLabel: {
        color: '#5F5E7D',
        fontSize: 14,
        lineHeight: 16,
        textAlign: 'center',
        marginBottom: 5
    },
    inputLabelCode: {
        fontSize: 12,
        color: '#5F5E7D',
        textAlign: 'center',
        marginBottom: 5
    },
    inputLabelCodeBottom: {
        fontSize: 12,
        color: '#969696',
        textAlign: 'center',
        marginBottom: 5
    },
    inputLabelLink: {
        fontSize: 12,
        color: '#FE5000',
        textAlign: 'center',
        marginBottom: 5,
        textDecorationStyle: 'solid',
        textDecorationColor: '#FE5000',
        textDecorationLine: 'underline'
    },
    labelTextWrapper: {
        borderWidth: 1,
        borderColor: '#FE5000'
    },

});

module.exports = AutorizationScreen;

import React, { useEffect, useState } from 'react';

import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import { isLogged, login } from './../../common/utils/api';
import SnackbarHandler from './../../common/components/Snackbar/snackbar';

import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { Formik } from 'formik';
import * as Yup from 'yup';
import UserContext from './UserContext';
const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%',
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
    logo: {
        backgroundColor: '#fafafa',
    },
}));

const Login = ({ setAuthInfo }): JSX.Element => {
    const [snack, setSnack] = useState({ open: false, message: '', type: 'success' });
    const classes = useStyles();

    const initialValues = {
        name: '',
        password: '',
    };
    const validationSchema = Yup.object({
        name: Yup.string().required(`Обов'язкове поле`),
        password: Yup.string().required(`Обов'язкове поле`),
    });
    const submitHandler = async (value) => {
        const logInfo = { email: value.name, password: value.password };
        const response = await login(logInfo);
        if (response.err) {
            setSnack({
                open: true,
                message: 'Неправильний логін або пароль',
                type: 'error',
            });
        }
        localStorage.setItem('admin_username', response.admin);
        const isAuth = await isLogged();
        setAuthInfo(isAuth);
    };

    return (
        <Container component='main' maxWidth='xs'>
            <CssBaseline />
            <div className={classes.paper}>
                <Typography component='h1' variant='h5'>
                    Ввійдіть
                </Typography>
                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={submitHandler}
                    validateOnMount={true}>
                    {(props) => (
                        <form className={classes.form} noValidate onSubmit={props.handleSubmit}>
                            <TextField
                                variant='outlined'
                                margin='normal'
                                required
                                fullWidth
                                id='name'
                                label='Електронна адреса'
                                name='name'
                                value={props.values.name}
                                onBlur={props.handleBlur}
                                onChange={props.handleChange}
                                helperText={props.touched.name ? props.errors.name : ''}
                                error={props.touched.name && Boolean(props.errors.name)}
                            />

                            <TextField
                                variant='outlined'
                                margin='normal'
                                required
                                fullWidth
                                name='password'
                                label='Пароль'
                                type='password'
                                id='password'
                                onBlur={props.handleBlur}
                                value={props.values.password}
                                onChange={props.handleChange}
                                helperText={props.touched.password ? props.errors.password : ''}
                                error={props.touched.password && Boolean(props.errors.password)}
                            />

                            <Button
                                disabled={!props.isValid}
                                type='submit'
                                fullWidth
                                variant='contained'
                                color='primary'
                                className={classes.submit}>
                                Вхід
                            </Button>
                        </form>
                    )}
                </Formik>
            </div>
            <SnackbarHandler snack={snack} setSnack={setSnack} />
        </Container>
    );
};
export default Login;

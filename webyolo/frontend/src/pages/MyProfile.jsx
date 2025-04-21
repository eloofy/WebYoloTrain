import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, Paper, Fade } from '@mui/material';
import Sidebar from '../components/layout/Sidebar';
import { getCookie }  from '../utils/GetCookie'
import { setMyInfo, GetMyInfo} from '../services/meService';
import {blueButtonStyle} from "../styles/authStyles";


const ProfilePage = () => {
    // Базовые значения берутся из cookies
    const [nickname, setNickname] = useState(getCookie('nickname'));
    const [email, setEmail] = useState(getCookie('email'));
    const [bio, setBio] = useState(getCookie('bio'));
    const [isEditable, setIsEditable] = useState(false);
    const [loading, setLoading] = useState(true);

    const fetchUserData = async () => {
        try {
            const response = await GetMyInfo();

            if (response.status === 200) {
                const data = response.data;
                setNickname(data.nickname);
                setEmail(data.email);
                setBio(data.bio);
            } else {
                console.error('Failed to fetch user data');
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUserData();
    }, []);

    const handleSave = async () => {
        try {
            const response = await setMyInfo(nickname, bio);

            if (response.status === 200) {
                setIsEditable(false);
                fetchUserData();
            } else {
                console.error('Failed to update profile');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
        }
    };

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#141824', color: 'white', ml: 13}}>
            <Sidebar active={'my-profile'}/>
            <Box sx={{ flex: 1, ml: '72px', px: 6, py: 5 }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 4, color: '#e2e8f0' }}>
                    My Profile
                </Typography>
                <Fade in timeout={400}>
                    <Paper sx={{ p: 4, bgcolor: '#1e293b', borderRadius: 3, boxShadow: 4 }}>
                        <Typography variant="h6" sx={{ mb: 3, color: '#94a3b8' }}>
                            Profile Settings
                        </Typography>

                        <TextField
                            label="Email"
                            value={email}
                            fullWidth
                            disabled
                            helperText="*Email can not change"
                            FormHelperTextProps={{
                                sx: {
                                    color: '#f34a3b !important'
                                }
                            }}
                            sx={{
                                mb: 3,
                                '& .MuiInputBase-input': {
                                    color: 'white',
                                },
                                '& .MuiInputBase-input.Mui-disabled': {
                                    WebkitTextFillColor: 'white',
                                }
                            }}
                            InputProps={{
                                sx: {
                                    backgroundColor: '#0f172a',
                                    borderRadius: 2,
                                },
                            }}
                            InputLabelProps={{ style: { color: '#94a3b8' } }}
                        />

                        <TextField
                            label="Nickname"
                            value={nickname}
                            onChange={(e) => setNickname(e.target.value)}
                            fullWidth
                            disabled={!isEditable}
                            sx={{
                                mb: 3,
                                '& .MuiInputBase-input': {
                                    color: 'white', // цвет обычного ввода
                                },
                                '& .MuiInputBase-input.Mui-disabled': {
                                    WebkitTextFillColor: 'white' // переопределяем цвет для заблокированного состояния
                                }
                            }}
                            InputProps={{
                                sx: {
                                    color: 'white',
                                    backgroundColor: '#0f172a',
                                    borderRadius: 2,
                                },
                            }}
                            InputLabelProps={{ style: { color: '#94a3b8' } }}
                        />

                        <TextField
                            label="Bio"
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            fullWidth
                            multiline
                            rows={4}
                            disabled={!isEditable}
                            sx={{
                                mb: 3,
                                '& .MuiInputBase-input': {
                                    color: 'white', // цвет обычного ввода
                                },
                                '& .MuiInputBase-input.Mui-disabled': {
                                    WebkitTextFillColor: 'white' // переопределяем цвет для заблокированного состояния
                                }
                            }}
                            InputProps={{
                                sx: {
                                    color: 'white',
                                    backgroundColor: '#0f172a',
                                    borderRadius: 2,
                                },
                            }}
                            InputLabelProps={{ shrink: true, style: { color: '#94a3b8' } }}
                        />

                        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                            {isEditable ? (
                                <Button variant="contained" onClick={handleSave} sx={{ ...blueButtonStyle, border: 'none' }}>
                                    Save Changes
                                </Button>
                            ) : (
                                <Button
                                    variant="outlined"
                                    onClick={() => setIsEditable(true)}
                                    sx={{
                                        ...blueButtonStyle,
                                        backgroundColor: 'transparent',
                                        border: '1px solid #0041e8',
                                        color: 'white',
                                        textTransform: 'none',
                                        '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' },
                                    }
                                }>
                                    Edit Profile
                                </Button>
                            )}
                        </Box>
                    </Paper>
                </Fade>
            </Box>
        </Box>
    );
};

export default ProfilePage;
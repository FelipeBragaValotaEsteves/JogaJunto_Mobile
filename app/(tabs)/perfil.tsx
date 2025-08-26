import { BackButtonTab } from '@/components/shared/BackButton';
import { ContentContainer } from '@/components/shared/ContentContainer';
import { MainContainer } from '@/components/shared/MainContainer';
import { TitlePageTabs } from '@/components/shared/TitlePage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { useFocusEffect, useRouter } from "expo-router";
import { Camera, CircleArrowLeft, LogOut } from "lucide-react-native";
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, Platform, View } from 'react-native';
import styled from 'styled-components/native';
import { Alert } from '../../components/shared/Alert';
import { Button, ButtonText } from '../../components/shared/Button';
import { Input } from '../../components/shared/Input';
import { Select } from '../../components/shared/Select';
import BASE_URL from "../../constants/config";

const USER_PROFILE_URL = `${BASE_URL}/users`;

export default function PerfilScreen() {
    const router = useRouter();

    const isWeb = Platform.OS === 'web';

    const [usuario, setUsuario] = useState('');
    const [email, setEmail] = useState('');
    const [imagem, setImagem] = useState<string | null>(null);
    const [imgServidor, setImgServidor] = useState<string | null>(null);

    const [open, setOpen] = useState(false);
    const [posicoes, setPosicoes] = useState<number[]>([]);
    const [items, setItems] = useState<{ label: string; value: number }[]>([]);
    const [imageFile, setImageFile] = useState<File | null>(null);

    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    const [alertVisible, setAlertVisible] = useState(false);
    const [alertConfig, setAlertConfig] = useState<{
        type: string;
        title: string;
        message: string;
        onConfirm?: (() => void) | undefined;
    }>({
        type: 'success',
        title: '',
        message: '',
        onConfirm: undefined,
    });

    const showAlert = (type: string, title: string, message: string, onConfirm?: () => void) => {
        setAlertConfig({ type, title, message, onConfirm });
        setAlertVisible(true);
    };

    const authHeaders = async () => {
        const t1 = await AsyncStorage.getItem('userToken');
        const t2 = await AsyncStorage.getItem('token');
        const token = t1 || t2 || '';
        return { Authorization: token ? `Bearer ${token}` : '' };
    };

    const escolherImagem = async () => {

        // if (isWeb) return;

        const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!perm.granted) {
            showAlert('error', 'Permissão necessária', 'Habilite o acesso à galeria.');
            return;
        }
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 0.9,
        });
        if (!result.canceled) {
            setImagem(result.assets[0].uri);
        }
    };

    useFocusEffect(
        useCallback(() => {
            let alive = true;
            (async () => {
                try {
                    setLoading(true);
                    const headers = await authHeaders();
                    const posRes = await fetch(`${BASE_URL}/posicao/list`, { headers });
                    if (!posRes.ok) throw new Error('Falha ao carregar posições');
                    const posicoesData: Array<{ id: number; nome: string }> = await posRes.json();
                    if (!alive) return;
                    setItems(posicoesData.map(p => ({ label: p.nome, value: p.id })));
                    const meRes = await fetch(`${BASE_URL}/usuarios/me`, { headers });
                    if (!meRes.ok) throw new Error('Falha ao carregar usuário');
                    const me = await meRes.json();
                    if (!alive) return;
                    setUsuario(me?.nome ?? '');
                    setEmail(me?.email ?? '');
                    setImgServidor(me?.imgUrl ?? null);
                    if (Array.isArray(me?.posicoes)) {
                        setPosicoes(me.posicoes.map((p: any) => p.id));
                    }
                } catch (err: any) {
                    console.error(err);
                    showAlert('error', 'Erro', err?.message || 'Não foi possível carregar os dados.');
                } finally {
                    setLoading(false);
                }
            })();
            return () => { alive = false; };
        }, [])
    );

    const salvarPerfil = async () => {
        try {
            setSaving(true);
            const headers = await authHeaders();
            const form = new FormData();
            form.append('name', usuario);
            form.append('email', email);
            form.append('positions', JSON.stringify(posicoes));

            if (isWeb) {
                if (imageFile) form.append('img', imageFile);
            } else {
                if (imagem) {
                    const filename = imagem.split('/').pop() || `avatar_${Date.now()}.jpg`;
                    const ext = filename.split('.').pop()?.toLowerCase();
                    const mime =
                        ext === 'png' ? 'image/png' :
                            ext === 'jpg' || ext === 'jpeg' ? 'image/jpeg' :
                                'application/octet-stream';
                    form.append('img', {
                        uri: Platform.OS === 'android' ? imagem : imagem.replace('file://', ''),
                        name: filename,
                        type: mime,
                    } as any);
                }
            }

            const res = await fetch(`${BASE_URL}/usuarios/me`, {
                method: 'PATCH',
                headers: { ...headers, ...(Platform.OS === 'web' ? {} : {}) },
                body: form,
            });
            if (!res.ok) {
                const errorJson = await safeJson(res);
                throw new Error(errorJson?.message || `Erro ${res.status}`);
            }
            showAlert('success', 'Sucesso', 'Perfil atualizado!');
        } catch (err: any) {
            console.error(err);
            showAlert('error', 'Erro', err?.message || 'Não foi possível salvar.');
        } finally {
            setSaving(false);
        }
    };

    const safeJson = async (r: Response) => {
        try { return await r.json(); } catch { return null; }
    };

    const sair = async () => {
        await AsyncStorage.removeItem('userToken');
        await AsyncStorage.removeItem('token');
        router.replace("/login");
    };

    return (
        <MainContainer>
            <TopButtonsContainer>
                <BackButtonTab onPress={() => router.back()} >
                    <CircleArrowLeft color="#2B6AE3" size={50} />
                </BackButtonTab>
                <SairButton onPress={sair}>
                    <LogOut color="#2B6AE3" size={30} />
                </SairButton>
            </TopButtonsContainer>

            <TitlePageTabs>Perfil</TitlePageTabs>
            <ContentContainer>
                {loading ? (
                    <ActivityIndicator size="large" />
                ) : (
                    <>
                        {!isWeb ? (
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                            />
                        ) : (
                            <ImagemContainer onPress={escolherImagem}>
                                {imagem ? (
                                    <Imagem source={{ uri: imagem }} />
                                ) : imgServidor ? (
                                    <Imagem source={{ uri: imgServidor }} />
                                ) : (
                                    <PlaceholderImagem>
                                        <Camera color="#B0BEC5" />
                                    </PlaceholderImagem>
                                )}
                            </ImagemContainer>
                        )}

                        <Input
                            placeholder="Usuário"
                            value={usuario}
                            onChangeText={setUsuario}
                        />

                        <Input
                            placeholder="Email"
                            keyboardType="email-address"
                            autoCapitalize="none"
                            value={email}
                            onChangeText={setEmail}
                        />

                        <View>
                            <Select
                                label="Posições favoritas"
                                helperText="Escolha uma ou mais"
                                multiple
                                mode="BADGE"
                                open={open}
                                value={posicoes}
                                items={items}
                                setOpen={setOpen}
                                setValue={setPosicoes as any}
                                setItems={setItems}
                                placeholder="Posições favoritas"
                                badgeDotColors={["#2B6AE3", "#26a69a", "#ef6c00", "#7e57c2"]}
                                zIndex={2000}
                            />
                        </View>

                        <Button onPress={salvarPerfil} disabled={saving}>
                            <ButtonText>{saving ? 'SALVANDO...' : 'SALVAR'}</ButtonText>
                        </Button>
                    </>
                )}
            </ContentContainer>

            <Alert
                visible={alertVisible}
                type={alertConfig.type}
                title={alertConfig.title}
                message={alertConfig.message}
                onClose={() => setAlertVisible(false)}
                onConfirm={alertConfig.onConfirm}
            />
        </MainContainer>
    );
}

const ImagemContainer = styled.TouchableOpacity`
  align-self: center;
  margin-bottom: 20px;
`;

const Imagem = styled.Image`
  width: 200px;
  height: 200px;
  border-radius: 100px;
`;

const PlaceholderImagem = styled.View`
  width: 150px;
  height: 150px;
  border-radius: 75px;
  background-color: #e2e8f0;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
`;

const PickerContainer = styled.View`
  margin-bottom: 20px;
  z-index: 10;
`;

const TopButtonsContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
  margin-bottom: 10px;
`;

const SairButton = styled.TouchableOpacity`
  padding: 8px 12px;
  border-radius: 8px;
  margin-left: 10px;
`;

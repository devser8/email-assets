const { useState, useCallback, useRef, useEffect, useMemo } = React;

// ─── GitHub Config ───
const GH_REPO = "devser8/email-assets";
const GH_API = `https://api.github.com/repos/${GH_REPO}/contents`;
// Raw URLs are available INSTANTLY after upload (no GitHub Pages deploy delay)
const GH_RAW_BASE = `https://raw.githubusercontent.com/${GH_REPO}/main`;

function getStoredToken(){ try{ return localStorage.getItem("gh_token")||""; }catch(e){ return""; } }
function storeToken(t){ try{ localStorage.setItem("gh_token",t); }catch(e){} }
function clearStoredToken(){ try{ localStorage.removeItem("gh_token"); }catch(e){} }

// ─── Email Constants ───
const BG_FALLBACK = "https://steamuserimages-a.akamaihd.net/ugc/844842639220145572/84F945A992EA069EF8FD6D77BF5E644A937D3589/?imw=5000&imh=5000&ima=fit&impolicy=Letterbox&imcolor=%23000000&letterbox=false";

function addUtm(baseUrl,campaign){
  if(!baseUrl)return"#";
  const sep=baseUrl.includes("?")?"&":"?";
  return`${baseUrl}${sep}utm_source=mailing&utm_medium=mailing&utm_campaign=${campaign}`;
}

// ─── Brand Configs ───
// Each brand defines generateHeader(utm) and generateFooter(utm) functions
// that return the raw HTML string for the header/footer sections.
const BRANDS = {
  spring: {
    label: "Colchones Spring",
    color: "#4a9eff",
    generateHeader: (utm) => `    <header>
      <table border="0" cellspacing="0" cellpadding="0">
        <tr>
          <td class="logo">
            <a href="${addUtm("https://www.colchonesspring.com.co/",utm)}">
              <img src="https://colchonesspring.vteximg.com.br/arquivos/LOGO-MOMENTOS-2026.png" alt="Logo" class="logo" />
            </a>
          </td>
        </tr>
      </table>
    </header>`,
    generateFooter: (utm) => `    <footer>
      <table width="600" border="0" cellspacing="0" cellpadding="0" style="background-color: #1a1a1a; color: #ffffff; font-family: 'Poppins', sans-serif; font-size: 11px; line-height: 1.6;">
        <tr>
          <td style="padding: 65px 30px;" valign="top" width="140">
            <a href="${addUtm("https://www.colchonesspring.com.co/",utm)}" style="text-decoration: none;">
              <img src="https://colchonesspring.vteximg.com.br/arquivos/SPRING%20BLACO.png" alt="Spring" style="width: 100px; display: block; margin-bottom: 4px;" />
            </a>
          </td>
          <td style="padding: 20px 15px;" valign="top" width="260">
            <p style="margin: 0 0 2px; font-weight: 700; font-size: 12px;">Contáctenos</p>
            <p style="margin: 0 0 2px; color: #cccccc;">Servicio al cliente, teléfono de contacto</p>
            <p style="margin: 0 0 10px; color: #ffffff;">(601) 307 70 53</p>
            <p style="margin: 0 0 6px; font-weight: 700;">Síguenos en nuestras redes:</p>
            <div>
              <a href="https://www.facebook.com/ColchonesSpring/" style="text-decoration: none; margin-right: 8px;"><img src="https://colchonesspring.vteximg.com.br/arquivos/facebooknew2025.png" alt="Facebook" style="width: 22px; height: 22px; vertical-align: middle;"/></a>
              <a href="https://www.youtube.com/user/ColchonesSpringCol" style="text-decoration: none; margin-right: 8px;"><img src="https://colchonesspring.vteximg.com.br/arquivos/youtubenew2025.png" alt="YouTube" style="width: 22px; height: 22px; vertical-align: middle;"/></a>
              <a href="https://www.tiktok.com/@colchonesspringcol" style="text-decoration: none; margin-right: 8px;"><img src="https://colchonesspring.vteximg.com.br/arquivos/tiktoknew2025.png" alt="TikTok" style="width: 22px; height: 22px; vertical-align: middle;"/></a>
              <a href="https://www.instagram.com/colchonesspring/" style="text-decoration: none;"><img src="https://colchonesspring.vteximg.com.br/arquivos/instagramnew2025.png" alt="Instagram" style="width: 22px; height: 22px; vertical-align: middle;"/></a>
            </div>
          </td>
          <td style="padding: 20px 25px 20px 15px;" valign="top" width="200">
            <p style="margin: 0 0 2px; font-weight: 700; font-size: 12px;">Escríbenos a:</p>
            <a href="mailto:scliente@spring.com.co" style="color: #ffffff; text-decoration: none;">scliente@spring.com.co</a>
            <p style="margin: 14px 0 0; color: #cccccc;">Si deseas cancelar la<br/>suscripción <a href="https://momentos.spring.com.co/desuscribirse?email=::subscriber.email::" target="_blank" style="color: #ffffff; text-decoration: underline; font-weight: 700;">haz clic aquí</a></p>
          </td>
        </tr>
      </table>
    </footer>`,
    headerStyle: `
      header { height: 39px; width: 600px; background-color: #1a1a1a; color: white; }
      .logo { width: 75px; height: 23px; flex-shrink: 0; padding: 4px 135px; }
      footer { background-color: #1a1a1a; width: 600px; }`,
  },
  suarez: {
    label: "Suárez",
    color: "#e8a020",
    generateHeader: (utm) => `    <!-- HEADER -->
    <table class="srz-logo-mobile" border="0" cellpadding="0" cellspacing="0" width="100%" align="center" bgcolor="#FFFFFF">
        <tr>
            <td>
                <table class="srz-logo-mobile" border="0" cellpadding="0" cellspacing="0" width="600" align="center" style="background-color:#292929; max-width: 100%;">
                    <tr>
                        <td bgcolor="" style="text-align: center; height: 34px; vertical-align: middle; " width="100%" valign="top">
                            <a href="${addUtm("https://suarezclothing.com",utm)}" target="_blank" title="Suarez Colombia" style="text-align:center; outline: none; color: #FFF;"><img width="100" style="margin:9px auto;" alt="Suarez Colombia" src="https://suarez.vteximg.com.br/arquivos/SRZ_LOGO_BLANCO_CORREO2.png"></a>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
    <!-- /HEADER -->`,
    generateFooter: (utm) => `    <table border="0" class="container" cellpadding="0" cellspacing="0" width="100%" bgcolor="#EEEEEF" style="font-family: Arial, sans-serif;">
        <tr>
            <td bgcolor="#FFF" align="center">
                <!--Footer redes sociales-->
                <table align="center" border="0" class="srz-container" cellpadding="0" cellspacing="0" width="600" style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #222222">
                    <tbody>
                        <tr>
                            <td width="100%" class="srz-container" style="display:flex; text-align:center; color:#292929; padding: 15px 0 0; font-size: 10px; text-transform: uppercase; font-weight: bold; margin: 0 auto; text-align: center;">
                                <a class="srz-fb-mobile" href="${addUtm("https://suarezclothing.com/",utm)}" target="_blank" style="margin:0 auto; text-align: center; vertical-align: middle;"><img width="100px" src="https://suarez.vteximg.com.br/arquivos/SRZ_LOGO_BLANCO_CORREO2.png" alt="Logo" style="display: inline-block;padding: 8px;"></a>
                            </td>
                        </tr>
                        <tr>
                            <td width="100%" class="srz-container" style="display:flex; text-align:center; color:#292929; padding: 15px 0 0; font-size: 10px; text-transform: uppercase; font-weight: bold; margin: 0 auto; text-align: center;">
                                <p style="margin: 0 auto; font-size:14px; color: #fff; font-family:Arial, Helvetica, sans-serif; font-weight: bold;">SÍGUENOS</p>
                            </td>
                        </tr>
                        <tr>
                            <td width="50%" class="srz-container" style="display:flex; text-align:center; color:#292929; padding: 15px 0 0; font-size: 10px; text-transform: uppercase; font-weight: bold; margin: 0 auto;">
                                <a class="srz-fb-mobile" href="https://www.facebook.com/suarezclothing" target="_blank" style="margin:0 auto; margin-left: 0; text-align: center; vertical-align: middle;"><img width="32" src="https://suarez.vteximg.com.br/arquivos/fb-icon.png" alt="Whatsapp" style="display: inline-block;padding: 8px;"></a>
                                <a href="https://www.instagram.com/suarezclothing/" target="_blank" style="margin:0 auto; text-align: center; vertical-align: middle;"><img width="32" src="https://suarez.vteximg.com.br/arquivos/ig-icon.png" alt="Mail" style="display: inline-block;padding: 8px;"></a>
                                <a href="https://twitter.com/suarezclothing" target="_blank" style="margin:0 auto; text-align: center; vertical-align: middle;"><img width="32" src="https://suarez.vteximg.com.br/arquivos/tw-icon.png" alt="Facebook" style="display: inline-block;padding: 8px; padding-top: 12px;"></a>
                                <a href="https://www.youtube.com/channel/UCaLH-9-UVNwr7SqzaGmecuQ" target="_blank" style="margin:0 auto; text-align: center; vertical-align: middle;"><img width="32" src="https://suarez.vteximg.com.br/arquivos/yt-icon.png" alt="Instagram" style="display: inline-block;padding: 8px;margin-top: 5px;"></a>
                                <a href="https://www.strava.com/athletes/74578300" target="_blank" style="margin:0 auto; text-align: center; vertical-align: middle;"><img width="32" src="https://suarez.vteximg.com.br/arquivos/strava-icon.png" alt="Instagram" style="display: inline-block;padding: 8px;"></a>
                            </td>
                        </tr>
                        <tr>
                            <td width="100%" class="srz-container srz-help-mobile" style="text-align:center; color:#292929; padding: 7px 0px; font-size: 14.22px; font-weight: bold;">
                                <p class="srz-contact-title-mobile" style="font-size:14px;color:#fff;font-family: Arial, Helvetica, sans-serif;text-decoration: none; font-weight: bold;margin-top: 25px; padding: 0; margin-bottom: 10px;">CONTACTO</p>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <table align="center" border="0" class="srz-container" cellpadding="0" cellspacing="0" width="600" style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #222222;">
                    <tbody>
                        <tr>
                            <td class="srz-contact-mobbile-container srz-wp" style="text-align:center; color:#fff; font-size: 14.22px;">
                                <p class="srz-contact-mobile" style="font-size:12.64px;color:#fff;font-family: 'Quicksand', sans-serif; padding-bottom: 30px; font-weight: 400;"><img src="https://suarez.vteximg.com.br/arquivos/wp-icon.png" class="srz-contact-icon-mobile" alt="Whatsapp" style="vertical-align: bottom;padding-right: 4px;"><a href="#" target="_blank" rel="noopener noreferrer" style="color:#fff !important; text-decoration:none !important;">(+57) 316 832 91 24</a></p>
                            </td>
                            <td class="srz-contact-mobbile-container srz-tel" style="text-align:center; color:#fff; font-size: 14.22px;">
                                <p class="srz-contact-mobile" style="font-size:12.64px;color:#fff;font-family: 'Quicksand', sans-serif; padding-bottom: 30px; font-weight: 400;"><img src="https://suarez.vteximg.com.br/arquivos/phone-icon.png" class="srz-contact-icon-mobile" alt="Telefono" style="vertical-align: bottom;padding-right: 4px;"><a href="#" target="_blank" rel="noopener noreferrer" style="color:#fff !important; text-decoration:none !important;">(+57 604) 322 55 60</a></p>
                            </td>
                            <td class="srz-contact-mobbile-container srz-mail" style="text-align:center; color:#fff; font-size: 14.22px; width: 40%;">
                                <p class="srz-contact-mobile" style="font-size:12.64px;color:#fff;font-family: 'Quicksand', sans-serif; padding-bottom: 30px; font-weight: 400;"><img src="https://suarez.vteximg.com.br/arquivos/mail-icon.png" class="srz-contact-icon-mobile" alt="Correo" style="vertical-align: bottom;padding-right: 4px;"><a href="mailto:servicioalcliente@suarez.com.co" target="_blank" rel="noopener noreferrer" style="color:#fff !important; text-decoration:none !important;">servicioalcliente@suarez.com.co</a></p>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <!--/Footer redes sociales-->
                <!--MENU-->
                <table width="600" cellpadding="0" cellspacing="0" border="0" align="center" bgcolor="#FFF" style="border-top: 1px solid #C5C6C8; max-width: 100%; padding: 0 10px;" class="srz-container">
                    <tbody>
                        <tr>
                            <td style="width:30%; font-family: 'Quicksand', sans-serif;background-color:#222222; padding-top:4px; padding-bottom:4px;text-align: center; margin-top: 25px;">
                                <a class="menu-item-mobile" href="${addUtm("https://suarezclothing.com/preguntas-frecuentes",utm)}" target="_blank" style="text-decoration: none; font-weight: 400;font-size: 14px;color: #fff !important; line-height: 15px;"><p style="margin: 12px 0;color: #fff !important;">Preguntas frecuentes</p></a>
                            </td>
                            <td style="width:30%; font-family: 'Quicksand', sans-serif;background-color:#222222; padding-top:4px; padding-bottom:4px;text-align: center;">
                                <a class="menu-item-mobile" href="${addUtm("https://suarezclothing.com/terminos-y-condiciones",utm)}" target="_blank" style="text-decoration: none; font-weight: 400;font-size: 14px;color: #fff !important; line-height: 15px;"><p style="margin: 12px 0;color: #fff !important;">Terminos y condiciones</p></a>
                            </td>
                            <td class="legal-mobile" style="width:30%; font-family: 'Quicksand', sans-serif;background-color:#222222; padding-top:4px; padding-bottom:4px;text-align: center;">
                                <a class="menu-item-mobile" href="${addUtm("https://suarezclothing.com/politica-de-privacidad-y-condiciones-de-uso",utm)}" target="_blank" style="text-decoration: none; font-weight: 400;font-size: 14px;color: #fff !important; line-height: 15px;"><p style="margin: 25px 0;color: #fff !important;">Aviso legal</p></a>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <table width="600" cellpadding="0" cellspacing="0" border="0" align="center" bgcolor="#FFF" style="max-width: 100%; padding: 0 10px;" class="srz-container">
                    <tbody>
                        <tr>
                            <td style="width:30%; font-family: 'Quicksand', sans-serif;background-color:#222222; padding-top:4px; padding-bottom:4px;text-align: center; margin-top: 25px;">
                                <p style="margin: 0px 0 45px;color: #D4D4D4 !important; font-size: 10px; padding: 0 20px;">Suarez ©2023</p>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </td>
        </tr>
    </table>`,
    headerStyle: `
      header { width: 600px; background-color: #292929; }
      footer { background-color: #222222; width: 600px; }
      @media screen and (max-width: 640px) {
        .srz-logo-mobile { width: 100% !important; }
        .srz-container { width: 100% !important; }
        .srz-fb-mobile { margin-left: auto !important; }
        .srz-help-mobile { padding-bottom: 0 !important; }
        .srz-contact-title-mobile { margin: 5px auto !important; }
        .srz-contact-mobbile-container { width: 50% !important; }
        .srz-contact-mobile { font-size: 6px !important; }
        .srz-contact-icon-mobile { width: 8px !important; padding-right: 0 !important; margin-bottom: 3px !important; }
        .srz-mail { width: 40% !important; }
        .srz-wp, .srz-tel { width: 30% !important; }
      }`,
  },
  challenger: {
    label: "Challenger",
    color: "#ef4444",
    generateHeader: (utm) => `    <header>
      <table border="0" cellspacing="0" cellpadding="0" width="600">
        <tbody>
          <tr>
            <td valign="top" align="center" style="background:black;border-bottom:1px solid #DEDEDE;height:79px;">
              <table border="0" cellspacing="0" cellpadding="0" width="600">
                <tbody>
                  <tr>
                    <td style="width:140px;padding:30px;margin:0 auto;display:block;">
                      <table border="0" cellspacing="0" cellpadding="0" width="140">
                        <tbody>
                          <tr>
                            <td style="margin:0 auto;display:block;">
                              <a href="${addUtm("https://www.challenger.com.co/",utm)}" style="margin:0 auto;display:block;">
                                <img src="https://challengerco.vteximg.com.br/arquivos/challenger-logo-triggers.png" style="width:140px;margin:0 auto;display:block;" alt="Challenger"/>
                              </a>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
    </header>`,
    generateFooter: (utm) => `    <footer>
      <table border="0" cellspacing="0" cellpadding="0" width="600">
        <tbody>
          <tr>
            <td style="background-color:#003494;height:110px;padding:20px;">
              <table style="width:100%;height:100%;" border="0" cellspacing="0" cellpadding="0">
                <tbody>
                  <tr>
                    <td style="width:36%;text-align:center;">
                      <a href="${addUtm("https://www.challenger.com.co/",utm)}">
                        <img src="https://challengerco.vteximg.com.br/arquivos/challenger-logo-triggers.png" alt="Challenger" style="max-width:54%;height:auto;margin:0 auto;display:block;"/>
                      </a>
                    </td>
                    <td style="width:38%;color:white;text-align:left;font-size:13px;font-weight:600;line-height:normal;">
                      <span style="padding:5px 0;">Contáctenos</span><br/>
                      <span style="padding:5px 0;font-weight:300;">Servicio al cliente, teléfono de contacto</span><br/>
                      <a href="tel:+6014256000" style="font-weight:300;padding:5px 0;text-decoration:none;color:white;">(601) 425 6000</a><br/>
                      <span style="padding:5px 0;">Síguenos en nuestras redes:</span>
                      <a href="https://www.facebook.com/challengercolombia" target="_blank"><img src="https://vugravity.vteximg.com.br/arquivos/logo-face.png" alt="Facebook" style="max-width:7%;height:auto;padding:0 3px;"/></a>
                      <a href="https://www.instagram.com/challengercolombia" target="_blank"><img src="https://vugravity.vteximg.com.br/arquivos/logo-inst.png" alt="Instagram" style="max-width:7%;height:auto;padding:0 3px;"/></a>
                      <a href="https://www.youtube.com/challengercolombia" target="_blank"><img src="https://vugravity.vteximg.com.br/arquivos/logo-yt.png" alt="YouTube" style="max-width:7%;height:auto;padding:0 3px;"/></a>
                    </td>
                    <td style="width:25%;color:white;text-align:left;font-size:13px;font-weight:700;line-height:normal;">
                      Escríbenos a:<br/>
                      <a href="mailto:scliente@challenger.com.co" style="font-weight:300;color:white;text-decoration:none;">scliente@challenger.com.co</a>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
    </footer>`,
    headerStyle: `
      header { width: 600px; }
      footer { width: 600px; }`,
  },
  gallery: {
    label: "Gallery",
    color: "#a855f7",
    generateHeader: (utm) => `    <!---Header-->
    <table border="0" cellspacing="0" cellpadding="0" width="600" align="center">
        <tr valign="top" style="background: #ffffff; width: 600px;">
            <td>
                <a href="${addUtm("https://www.gallerycolombia.com/",utm)}">
                    <img src="https://gallery.vteximg.com.br/arquivos/header-mails-gallery.png" alt="Gallery" style="display:block; width:600px;">
                </a>
            </td>
        </tr>
    </table>`,
    generateFooter: (utm) => `    <!---Footer-->
    <table border="0" cellspacing="0" cellpadding="0" width="600" align="center">
        <tr>
            <td align="center" style="background-image: url(https://gallery.vteximg.com.br/arquivos/fondo-footer-mailings.png); padding: 10px 20px;">
                <img src="https://gallery.vteximg.com.br/arquivos/LOGO-mailing.png" alt="Gallery">
                <table border="0" cellspacing="0" cellpadding="0" align="center">
                    <tbody>
                        <tr>
                            <td>
                                <a href="https://wa.me/57" target="_blank">
                                    <img src="https://gallery.vteximg.com.br/arquivos/mdi_whatsapp.png" alt="Whatsapp Icono" style="width: 14.4px; margin: 0px 7px;">
                                </a>
                            </td>
                            <td>
                                <a href="https://www.facebook.com/gallerycolombia" target="_blank">
                                    <img src="https://gallery.vteximg.com.br/arquivos/ri_facebook-fill.png" alt="Facebook Icono" style="width: 14.4px; margin: 0px 7px;">
                                </a>
                            </td>
                            <td>
                                <a href="https://www.youtube.com/@gallerycolombia" target="_blank">
                                    <img src="https://gallery.vteximg.com.br/arquivos/mdi_youtube.png" alt="Youtube Icono" style="width: 14.4px; margin: 0px 7px;">
                                </a>
                            </td>
                            <td>
                                <a href="https://www.instagram.com/gallerycolombia" target="_blank">
                                    <img src="https://gallery.vteximg.com.br/arquivos/iconoir_instagram.png" alt="Instagram Icono" style="width: 14.4px; margin: 0px 7px;">
                                </a>
                            </td>
                            <td>
                                <a href="https://www.tiktok.com/@gallerycolombia" target="_blank">
                                    <img src="https://gallery.vteximg.com.br/arquivos/ic_baseline-tiktok.png" alt="Tiktok Icono" style="width: 14.4px; margin: 0px 7px;">
                                </a>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <p style="color: #FFF; text-align: center; font-size: 8.4px; font-style: normal; font-weight: 400;">
                    ©2025 Gallery - Todos los derechos reservados
                </p>
            </td>
        </tr>
    </table>`,
    headerStyle: `
      header { width: 600px; background-color: #ffffff; }
      footer { width: 600px; }`,
  },
  almacenessi: {
    label: "Almacenes Sí",
    color: "#10b981",
    pending: true,
    generateHeader: (utm) => `    <!-- HEADER ALMACENES SÍ — pendiente configurar -->
    <header style="height:60px;width:600px;background-color:#1a1a1a;display:flex;align-items:center;justify-content:center;">
      <p style="color:#fff;margin:0;font-size:12px;">Header Almacenes Sí — por configurar</p>
    </header>`,
    generateFooter: (utm) => `    <!-- FOOTER ALMACENES SÍ — pendiente configurar -->
    <footer style="background-color:#1a1a1a;width:600px;padding:20px;text-align:center;">
      <p style="color:#fff;margin:0;font-size:11px;">Footer Almacenes Sí — por configurar</p>
    </footer>`,
    headerStyle: `
      header { height: 60px; width: 600px; background-color: #1a1a1a; color: white; }
      footer { background-color: #1a1a1a; width: 600px; }`,
  },
  rosen: {
    label: "Rosen",
    color: "#f43f5e",
    generateHeader: (utm) => `    <!--HEADER-->
    <table style="padding: 0; font-family: Arial, sans-serif; margin: auto; border-spacing: inherit; color: #2f353d; width: 716px; background: #fff;">
        <tbody style="margin: 0; padding: 0; font-family: Arial, sans-serif; border: solid 1px #000;">
            <tr style="margin: 0; padding: 0; font-family: Arial, sans-serif; width: 100%;">
                <th style="margin: 0; padding: 0; font-family: Arial, sans-serif; width: 100%; height: 224px; background: #38484d;">
                    <a href="${addUtm("https://www.rosen.com.co",utm)}" target="_blank">
                        <img src="https://rosenco.vteximg.com.br/arquivos/logo-verde-rosen.png" alt="Rosen.com.co" style="margin: 0; padding: 0; font-family: Arial, sans-serif; width: 150px; height: 70px;">
                    </a>
                </th>
            </tr>
            <tr style="margin: 0; padding: 0; font-family: Arial, sans-serif; width: 100%;">
                <td style="margin: 0; font-family: Arial, sans-serif; padding: 42px 42px 35px; width: 100%; text-align: center;">
                    <h1 style="margin: 0; padding: 0; font-family: Arial, sans-serif; font-size: 24px; color: #2f353d; font-weight: 900;">¡Orden Recibida!</h1>
                    <p style="padding: 0; font-family: Arial, sans-serif; margin: 12px 0px; font-size: 13px; line-height: 19px; color: #353535; font-weight: 500;">Realizada el: {{formatDate orders.0.creationDate}}</p>
                    <span style="padding: 0; font-family: Arial, sans-serif; color: #2f353d; font-weight: 900; padding-top: 13px; width: 100px; border-bottom: 1px solid #2f353d; height: 1px; display: block; margin: 0 auto;"></span>
                </td>
            </tr>
        </tbody>
    </table>
    <!--/HEADER-->`,
    generateFooter: (utm) => `    <!--FOOTER-->
    <table style="padding: 0; font-family: Arial, sans-serif; margin: auto; border-spacing: inherit; color: #2f353d; width: 716px; background: #fff;">
        <tr style="margin: 0; padding: 0; font-family: Arial, sans-serif; width: 100%;">
            <td style="margin: 0; font-family: Arial, sans-serif; display: block; text-align: center; padding: 50px;">
                <h1 style="margin: 0; padding: 0; font-family: Arial, sans-serif; font-size: 24px; color: #2f353d; font-weight: 900;">Gracias por elegir <b style="margin: 0; padding: 0; font-family: Arial, sans-serif; color: #2f353d; font-weight: 900; border: none; display: inline; letter-spacing: 0; font-size: 23px; text-transform: initial;">Rosen.com.co</b></h1>
                <a href="${addUtm("https://www.rosen.com.co",utm)}" target="_blank" style="font-family: Arial, sans-serif; padding: 0; text-decoration: none; display: block; width: 325px; color: #323232; font-weight: 100; margin: 33px auto 0px auto; text-align: center; border: 1px solid #bfbfbf; font-size: 11px; letter-spacing: .2em; position: relative; line-height: 50px; text-transform: uppercase;">IR A Rosen.com.co</a>
            </td>
        </tr>
    </table>
    <!--/FOOTER-->`,
    headerStyle: `
      header { width: 716px; background-color: #fff; }
      footer { width: 716px; background-color: #fff; }`,
  },
  springstep: {
    label: "Spring Step",
    color: "#06b6d4",
    generateHeader: (utm) => `    <!--HEADER-->
    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="box-shadow: 1px 1px 2px rgb(0 0 0 / 10%);">
        <tr>
            <td align="center">
                <div style="width: 90%; margin: auto; text-align: center; padding: 8px 0;">
                    <a href="${addUtm("https://www.springstep.com/",utm)}" style="text-decoration: none;">
                        <img title="logo" style="width: auto; height: auto; max-width: 150px;" src="https://springstep.vtexassets.com/arquivos/ss-logo.png" alt="logo-springstep">
                    </a>
                </div>
            </td>
        </tr>
    </table>
    <!--/HEADER-->`,
    generateFooter: (utm) => `    <!--FOOTER-->
    <table width="100%" border="0" cellspacing="0" cellpadding="0">
        <tr style="box-sizing: border-box; margin-top: 30px;" bgcolor="#f3f2f2">
            <td align="center">
                <div style="padding: 1rem 30px; margin: 0 0 1rem 0; font-family: Lato, sans-serif;">
                    <!-- Logo -->
                    <div style="margin-bottom: 10px;">
                        <img src="https://springstep.vtexassets.com/arquivos/ss-logo.png" alt="Spring Step" style="max-height: 35px;" />
                    </div>
                    <!-- Contacto -->
                    <div>
                        <p style="font-size: 14px; margin: 0; margin-top: 10px; color: #003F7B;">(+57) 311 5968258</p>
                        <span style="color: #003F7B; text-decoration: underline; font-size: 14px; margin: 0; margin-top: 10px;">ventasonline&#64;springstep&#46;com</span>
                    </div>
                    <!-- Redes sociales -->
                    <div style="margin-top: 10px;">
                        <p style="font-weight: bold; font-size: 14px; margin-top: 20px; margin-bottom: 20px; color: #003F7B;">Síguenos en</p>
                        <div>
                            <a href="https://www.facebook.com/Springstepoficial" style="text-decoration: none; padding: 0px 5px;">
                                <img title="Facebook" src="https://springstep.vteximg.com.br/arquivos/Social%20Icons.png" alt="Facebook" width="24" height="24" />
                            </a>
                            <a href="https://www.instagram.com/springstepcolombia/" style="text-decoration: none; padding: 0px 5px;">
                                <img title="Instagram" src="https://springstep.vteximg.com.br/arquivos/Group%2013.png" alt="Instagram" width="24" height="24" />
                            </a>
                            <a href="https://www.linkedin.com/company/calzado-spring-step/" style="text-decoration: none; padding: 0px 5px;">
                                <img title="Linkedin" src="https://springstep.vteximg.com.br/arquivos/Group%2012.png" alt="LinkedIn" width="24" height="24" />
                            </a>
                            <a href="https://www.tiktok.com/@springstepcolombia" style="text-decoration: none; padding: 0px 5px;">
                                <img title="Tiktok" src="https://springstep.vteximg.com.br/arquivos/Group%2011.png" alt="Tiktok" width="24" height="24" />
                            </a>
                        </div>
                    </div>
                    <!-- Línea -->
                    <hr style="margin: 20px 0; border: none; border-top: 1px solid #cccccc;" />
                    <!-- Derechos -->
                    <div style="font-size: 12px; color: #003F7B;">
                        © 2025 Spring Step. Todos los derechos reservados
                    </div>
                </div>
            </td>
        </tr>
    </table>
    <!--/FOOTER-->`,
    headerStyle: `
      a[x-apple-data-detectors] { color: inherit !important; text-decoration: none !important; font-size: inherit !important; font-family: inherit !important; font-weight: inherit !important; line-height: inherit !important; }
      @media (max-width: 600px) { img { max-width: 100% !important; height: auto !important; } }`,
  },
  tramontina: {
    label: "Tramontina",
    color: "#f59e0b",
    generateHeader: (utm) => `    <!--HEADER-->
    <table align="center" width="100%" cellspacing="0" cellpadding="0" border="0" bgcolor="#ffffff" style="padding-bottom: 25px">
        <tr>
            <td>
                <table align="center" width="100%" cellspacing="0" cellpadding="0" border="0" bgcolor="#1a1a1a">
                    <tr>
                        <td>
                            <table align="center" width="100%" cellspacing="0" cellpadding="0" border="0" bgcolor="#1a1a1a" style="max-width:600px">
                                <tr>
                                    <td>
                                        <table align="center" cellspacing="0" cellpadding="0" border="0" bgcolor="#1a1a1a" style="margin-bottom: 20px; margin-top: 20px">
                                            <tr>
                                                <td>
                                                    <a href="${addUtm("https://www.tramontinastore.com.co",utm)}" target="_blank"><img src="https://tramontinastoreco.vteximg.com.br/arquivos/logo-tramontina.png" alt="Tramontina" width="114" height="79" border="0"></a>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
    <!--/HEADER-->`,
    generateFooter: (utm) => `    <!-- RODAPE-->
    <table align="center" width="100%" cellspacing="0" cellpadding="0" border="0" bgcolor="#ffffff" style="padding-top: 25px">
        <tr>
            <td>
                <table align="center" width="100%" cellspacing="0" cellpadding="0" border="0" bgcolor="#1a1a1a">
                    <tr>
                        <td>
                            <table align="center" width="100%" cellspacing="0" cellpadding="0" border="0" bgcolor="#1a1a1a" style="max-width:600px">
                                <tr>
                                    <td>
                                        <table align="center" cellspacing="0" cellpadding="0" border="0" bgcolor="#1a1a1a" style="margin-bottom: 43px; margin-top: 43px">
                                            <tr>
                                                <td style="padding-left: 10px; padding-right: 10px">
                                                    <a href="https://www.facebook.com/TramontinaLatinoamerica/" title="Facebook Tramontina" target="_blank"><img src="https://tramontinastoreco.vteximg.com.br/arquivos/icon-facebook.png" alt="Facebook Tramontina" height="34" width="34" border="0"></a>
                                                </td>
                                                <td style="padding-left: 10px; padding-right: 10px">
                                                    <a href="https://www.instagram.com/tramontinaoficial/" title="Instagram Tramontina" target="_blank"><img src="https://tramontinastoreco.vteximg.com.br/arquivos/icon-instagram.png" alt="Instagram Tramontina" height="34" width="34" border="0"></a>
                                                </td>
                                                <td style="padding-left: 10px; padding-right: 10px">
                                                    <a href="https://www.youtube.com/user/tramontina" title="Youtube Tramontina" target="_blank"><img src="https://tramontinastoreco.vteximg.com.br/arquivos/icon-youtube.png" alt="Youtube Tramontina" height="34" width="34" border="0"></a>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
    <!-- /RODAPE-->`,
    headerStyle: `
      header { width: 600px; background-color: #1a1a1a; }
      footer { background-color: #1a1a1a; width: 600px; }`,
  },
};

let _blockId=0;
const uid=()=>`b${++_blockId}`;

// ─── GitHub Upload (returns raw URL, available instantly) ───
async function uploadToGitHub(file, token){
  const base64 = await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(",")[1]);
    reader.onerror = () => reject(new Error("Error leyendo archivo"));
    reader.readAsDataURL(file);
  });

  const rawName = file.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9._-]/g, "");
  const ext = rawName.includes(".") ? rawName.slice(rawName.lastIndexOf(".")) : "";
  const baseName = ext ? rawName.slice(0, rawName.lastIndexOf(".")) : rawName;
  const headers = {
    "Authorization": `token ${token}`,
    "Content-Type": "application/json",
    "Accept": "application/vnd.github.v3+json"
  };

  // Find a unique filename: file.png → file-1.png → file-2.png ...
  let filename = rawName;
  let attempt = 0;
  while(true){
    const checkUrl = `${GH_API}/img/${filename}`;
    try {
      const check = await fetch(checkUrl, { headers });
      if(!check.ok) break; // 404 = name is free
      attempt++;
      filename = `${baseName}-${attempt}${ext}`;
    } catch(e){ break; }
  }

  const path = `img/${filename}`;
  const body = { message: `Upload ${filename}`, content: base64 };

  const res = await fetch(`${GH_API}/${path}`, { method: "PUT", headers, body: JSON.stringify(body) });
  if(!res.ok){
    const err = await res.json().catch(()=>({}));
    if(err.message && err.message.includes("Bad credentials")) throw new Error("Token inválido o expirado");
    throw new Error(err.message || `Error ${res.status}`);
  }

  return `${GH_RAW_BASE}/${path}`;
}

// ─── Block Types ───
const BLOCK_TYPES=[
  {key:"banner",label:"Banner 100%",icon:"🖼",desc:"Imagen ancho completo con link"},
  {key:"productos",label:"Productos",icon:"📦",desc:"1, 2, 3 o más productos lado a lado"},
  {key:"contador",label:"Contador",icon:"⏱",desc:"Cuenta regresiva con timer"},
  {key:"cenefa",label:"Cenefa 100%",icon:"🎨",desc:"Imagen decorativa ancho completo"},
];

function createBlock(type){
  switch(type){
    case"banner":return{id:uid(),type:"banner",imgUrl:"",linkUrl:"",alt:"Banner"};
    case"productos":return{id:uid(),type:"productos",items:[{imgUrl:"",linkUrl:"",alt:"Producto 1"}]};
    case"contador":return{id:uid(),type:"contador",bgColor:"#FF1135",text:"Comenzó la cuenta regresiva",timerUrl:""};
    case"cenefa":return{id:uid(),type:"cenefa",imgUrl:"",linkUrl:"",alt:"Cenefa"};
    default:return null;
  }
}

// ─── HTML Generation ───
function generateBlockHTML(block, utm){
  switch(block.type){
    case"banner":return`
        <!-- BANNER -->
        <tr>
          <td align="center" style="background-image: url(${BG_FALLBACK});">
            <a href="${addUtm(block.linkUrl,utm)}">
              <img src="${block.imgUrl}" alt="${block.alt||"Banner"}" style="display: block; width: 600px;"/>
            </a>
          </td>
        </tr>`;
    case"productos":{
      const imgs=(block.items||[]).filter(p=>p.imgUrl).map(p=>`
              <a href="${addUtm(p.linkUrl,utm)}" style="text-decoration: none;">
                <img src="${p.imgUrl}" alt="${p.alt||"Producto"}" style="padding: 0 5px;">
              </a>`).join("");
      return`
        <!-- PRODUCTOS -->
        <tr>
          <td align="center" style="padding-top: 20px; background-image: url(${BG_FALLBACK});">
              ${imgs}
          </td>
        </tr>`;}
    case"contador":return`
        <!-- CONTADOR -->
        <tr>
          <td align="center" style="background-color: ${block.bgColor||"#FF1135"}; padding: 0px 10px;">
            <table border="0" cellSpacing="0" cellPadding="0" width="100%">
              <tbody>
                <tr>
                  <td align="center">
                    <p style="color: #fff; font-size: 18px; font-weight: 700; margin: 0;">${block.text||""}</p>
                  </td>
                  <td>
                    <img src="${block.timerUrl}" alt="Cuenta regresiva" width="250" style="display: block; height:5rem; object-fit:cover">
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>`;
    case"cenefa":return`
        <!-- CENEFA -->
        <tr>
          <td align="center" style="background-image: url(${BG_FALLBACK});">
            ${block.linkUrl?`<a href="${addUtm(block.linkUrl,utm)}">`:""}
              <img src="${block.imgUrl}" alt="${block.alt||"Cenefa"}" style="display: block; width: 600px;"/>
            ${block.linkUrl?`</a>`:""}
          </td>
        </tr>`;
    default:return"";
  }
}

function generateFullHTML(campaignName, preheader, blocks, brandKey){
  const utm=campaignName||"sin-nombre";
  const blocksHTML=blocks.map(b=>generateBlockHTML(b,utm)).join("\n");
  const hasPreheader=preheader&&preheader.trim();
  const brand=BRANDS[brandKey]||BRANDS.spring;
  return`<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${brand.label}</title>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;700&display=swap" rel="stylesheet"/>
    <style>
      body { font-family: "Poppins", sans-serif; margin: 0; padding: 0; background-color: white; color: #333; width: 600px !important; position: relative; }${brand.headerStyle}
      .text-footer-link { color: white !important; text-decoration: none; }${hasPreheader?`
      .preheader { display:none !important; visibility:hidden; opacity:0; height:0; width:0; }`:""}
    </style>
  </head>
  <body>
${hasPreheader?`    <span class="preheader">${preheader}</span>\n`:""}
${brand.generateHeader(utm)}

    <main>
      <table border="0" cellspacing="0" cellpadding="0" width="600">
${blocksHTML}
      </table>
    </main>

${brand.generateFooter(utm)}
  </body>
</html>`;
}

// ─── UI Components ───
const T={
  bg:"var(--bg)",chrome:"var(--chrome)",card:"var(--card)",card2:"var(--card-2)",input:"var(--input)",
  line:"var(--line)",line2:"var(--line-2)",line3:"var(--line-3)",
  text:"var(--text)",dim:"var(--dim)",faint:"var(--faint)",faintest:"var(--faintest)",
  hover:"var(--hover)",hover2:"var(--hover-2)",grip:"var(--grip)",
  canvas:"var(--canvas)",chip:"var(--chip)",sk:"var(--sk)",sk2:"var(--sk-2)",
  accent:"var(--accent)",accentFg:"var(--accent-fg)",accentSoft:"var(--accent-soft)",accentLine:"var(--accent-line)",
  shadow:"var(--shadow)"
};

function Ico({d,size=13,w=2,fill="none"}){
  return(
    <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke="currentColor" strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0}}>
      {d.map((p,i)=><path key={i} d={p}/>)}
    </svg>
  );
}
const I={
  mail:["M2 6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2Z","m2 7 10 6 10-6"],
  chevronDown:["m6 9 6 6 6-6"],
  chevronUp:["m6 15 6-6 6 6"],
  copy:["M9 9h10a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V11a2 2 0 0 1 2-2z","M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"],
  download:["M12 3v12","m7 11 5 5 5-5","M4 21h16"],
  eye:["M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7Z","M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"],
  eyeOff:["m3 3 18 18","M10.6 5.1A10.9 10.9 0 0 1 12 5c6.4 0 10 7 10 7a17 17 0 0 1-3.2 4.1","M6.2 6.2A17 17 0 0 0 2 12s3.6 7 10 7a10.6 10.6 0 0 0 5.3-1.4"],
  trash:["M3 6h18","M8 6V4h8v2","M19 6l-1 14H6L5 6"],
  undo:["M3 7v6h6","M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"],
  redo:["M21 7v6h-6","M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3L21 13"],
  sun:["M12 2v2","M12 20v2","M4.9 4.9l1.4 1.4","M17.7 17.7l1.4 1.4","M2 12h2","M20 12h2","M4.9 19.1l1.4-1.4","M17.7 6.3l1.4-1.4","M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z"],
  moon:["M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"],
  desktop:["M4 4h16a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1Z","M8 21h8"],
  mobile:["M7 3h10a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z","M11 18h2"],
  link:["M13 7h6a3 3 0 0 1 0 6h-2","M11 17H5a3 3 0 0 1 0-6h2","M8 10h8"],
  pencil:["M12 20h9","M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"],
  plus:["M12 5v14","M5 12h14"],
  check:["m5 13 4 4L19 7"],
  x:["M18 6 6 18","m6 6 12 12"],
  alert:["M12 9v4","M12 17h.01","M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"],
  code:["m8 6-6 6 6 6","m16 6 6 6-6 6"],
  send:["m22 2-7 20-4-9-9-4Z"],
  key:["M15 7a4 4 0 1 1-3.2 6.4L4 21H2v-2l7.6-7.8A4 4 0 0 1 15 7Z"],
  folder:["M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z"]
};

function Grip(){
  return(
    <svg width="12" height="14" viewBox="0 0 12 16" fill={T.grip} style={{flexShrink:0}}>
      <circle cx="3" cy="3" r="1.4"/><circle cx="9" cy="3" r="1.4"/><circle cx="3" cy="8" r="1.4"/>
      <circle cx="9" cy="8" r="1.4"/><circle cx="3" cy="13" r="1.4"/><circle cx="9" cy="13" r="1.4"/>
    </svg>
  );
}

function FloatingMenu({anchorRef,width,style,children}){
  const[pos,setPos]=useState(null);
  useEffect(()=>{
    const r=anchorRef.current?.getBoundingClientRect();
    if(r) setPos({top:r.bottom+6,left:r.left});
  },[anchorRef]);
  if(!pos) return null;
  return ReactDOM.createPortal(
    <div style={{position:"fixed",top:pos.top,left:pos.left,width,zIndex:1000,
      background:T.card,border:`1px solid ${T.line3}`,borderRadius:10,boxShadow:`0 14px 34px ${T.shadow}`,...style}}>
      {children}
    </div>,
    document.body
  );
}

function IconButton({title,onClick,children,danger,disabled}){
  const[h,setH]=useState(false);
  return(
    <button title={title} onClick={onClick} disabled={disabled}
      onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}
      style={{width:26,height:26,display:"flex",alignItems:"center",justifyContent:"center",border:0,borderRadius:6,
        background:h&&!disabled?(danger?"rgba(239,68,68,.14)":T.hover2):"transparent",
        color:disabled?T.faintest:h&&danger?"#ef4444":T.faint,
        cursor:disabled?"default":"pointer",opacity:disabled?.45:1,transition:"background .12s,color .12s"}}>
      {children}
    </button>
  );
}

function Input({label,value,onChange,placeholder,mono,right,required}){
  const[f,setF]=useState(false);
  const empty=required&&!value.trim();
  return(
    <div style={{marginBottom:10}}>
      {label&&(
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:5}}>
          <label style={{fontSize:10,fontWeight:700,color:T.faint,textTransform:"uppercase",letterSpacing:"0.07em"}}>
            {label}{required&&<span style={{color:"#ef4444"}}> *</span>}
          </label>
          {right}
        </div>
      )}
      <input type="text" value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder}
        onFocus={()=>setF(true)} onBlur={()=>setF(false)}
        style={{width:"100%",minWidth:0,height:34,padding:"0 10px",fontSize:12,fontFamily:mono?"ui-monospace,'SF Mono',monospace":"inherit",
          border:`1px solid ${f?T.accent:empty?"#ef4444":T.line3}`,borderRadius:8,background:T.input,color:T.text,outline:"none",boxSizing:"border-box",transition:"border-color .15s"}}
      />
    </div>
  );
}

function ImgUploadField({label,value,onChange,token,compact}){
  const[uploading,setUploading]=useState(false);
  const[dragOver,setDragOver]=useState(false);
  const[error,setError]=useState("");
  const fileRef=useRef(null);

  const handleFile=async(file)=>{
    if(!file||!file.type.startsWith("image/"))return;
    if(!token){setError("Token de GitHub no configurado");return;}
    setError("");setUploading(true);
    try{ const url=await uploadToGitHub(file,token); onChange(url); }
    catch(e){ setError("Error: "+e.message); }
    finally{ setUploading(false); }
  };

  const hasUrl=value&&value.startsWith("http");
  return(
    <div style={{marginBottom:10}}>
      {label&&<label style={{display:"block",fontSize:10,fontWeight:700,color:T.faint,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:5}}>{label}</label>}
      <div
        onDrop={e=>{e.preventDefault();setDragOver(false);const f=e.dataTransfer.files[0];if(f)handleFile(f);}}
        onDragOver={e=>{e.preventDefault();setDragOver(true);}}
        onDragLeave={()=>setDragOver(false)}
        onClick={()=>!uploading&&fileRef.current?.click()}
        style={{position:"relative",border:`1.5px dashed ${dragOver?T.accent:uploading?"#f59e0b":hasUrl?T.line3:T.line3}`,
          borderRadius:9,overflow:"hidden",cursor:uploading?"wait":"pointer",
          background:dragOver?T.accentSoft:hasUrl?"#fff":"transparent",
          height:compact?84:110,display:"flex",alignItems:"center",justifyContent:"center",transition:"all .15s",marginBottom:6}}>
        <input ref={fileRef} type="file" accept="image/*" style={{display:"none"}}
          onChange={e=>{const f=e.target.files[0];if(f)handleFile(f);e.target.value="";}}/>
        {uploading?(
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <div style={{width:14,height:14,border:"2px solid #f59e0b",borderTopColor:"transparent",borderRadius:"50%",animation:"spin .8s linear infinite"}}/>
            <span style={{fontSize:11,color:"#f59e0b",fontWeight:700}}>Subiendo…</span>
          </div>
        ):hasUrl?(
          <>
            <img src={value} alt="" style={{maxWidth:"100%",maxHeight:"100%",objectFit:"contain",display:"block"}}/>
            <button onClick={e=>{e.stopPropagation();onChange("");}}
              style={{position:"absolute",top:5,right:5,width:20,height:20,border:0,borderRadius:5,background:"rgba(13,15,19,.72)",color:"#fff",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>
              <Ico d={I.x} size={11} w={2.6}/>
            </button>
          </>
        ):(
          <div style={{textAlign:"center",color:T.faint,display:"flex",flexDirection:"column",alignItems:"center",gap:5}}>
            <span style={{color:T.accent}}><Ico d={I.plus} size={16}/></span>
            <p style={{fontSize:11,fontWeight:600,margin:0}}>Arrastra o haz click</p>
            <p style={{fontSize:9.5,margin:0,color:T.faintest}}>PNG, JPG, WEBP</p>
          </div>
        )}
      </div>
      <div style={{display:"flex",alignItems:"center",gap:6,minWidth:0}}>
        <span style={{fontSize:9.5,color:T.faintest,flexShrink:0}}>o pega URL</span>
        <input type="text" value={value} onChange={e=>onChange(e.target.value)} placeholder="https://...imagen.png"
          style={{flex:1,minWidth:0,height:26,padding:"0 8px",fontSize:10,fontFamily:"ui-monospace,monospace",border:`1px solid ${T.line}`,borderRadius:6,background:T.input,color:T.text,outline:"none",boxSizing:"border-box"}}/>
      </div>
      {error&&<div style={{fontSize:10,color:"#ef4444",marginTop:5,lineHeight:1.4}}>{error}</div>}
    </div>
  );
}

// ─── Block summary helpers ───
function blockThumbs(block){
  if(block.type==="productos")return (block.items||[]).map(i=>i.imgUrl).filter(Boolean).slice(0,3);
  return block.imgUrl?[block.imgUrl]:[];
}
function blockSummary(block){
  switch(block.type){
    case"banner":
    case"cenefa":{
      if(!block.imgUrl)return "Sin imagen";
      const name=block.imgUrl.split("/").pop();
      return block.linkUrl?`${name} → ${block.linkUrl.replace(/^https?:\/\//,"")}`:name;
    }
    case"productos":{
      const n=(block.items||[]).length;
      const full=(block.items||[]).filter(i=>i.imgUrl).length;
      return `${n} producto${n!==1?"s":""} · ${full} con imagen`;
    }
    case"contador":return block.text||"Cuenta regresiva";
    default:return "";
  }
}
function blockBadge(block){
  switch(block.type){
    case"banner":return{label:"100%",color:"#4a9eff"};
    case"productos":return{label:`${(block.items||[]).length} COLS`,color:"#a855f7"};
    case"contador":return{label:"TIMER",color:"#d97706"};
    case"cenefa":return{label:"FRANJA",color:"#14b8a6"};
    default:return{label:"",color:T.dim};
  }
}

function BlockCard({block,index,expanded,onToggle,onUpdate,onRemove,onDuplicate,onToggleHidden,token,dragProps,dragging}){
  const typeInfo=BLOCK_TYPES.find(t=>t.key===block.type);
  const badge=blockBadge(block);
  const thumbs=blockThumbs(block);
  const hidden=!!block.hidden;

  const renderFields=()=>{
    switch(block.type){
      case"banner":return(<>
        <ImgUploadField label="Imagen banner" value={block.imgUrl} onChange={v=>onUpdate({...block,imgUrl:v})} token={token}/>
        <Input label="URL destino (click)" value={block.linkUrl} onChange={v=>onUpdate({...block,linkUrl:v})} placeholder="https://..." mono/>
        <Input label="Texto alternativo (alt)" value={block.alt} onChange={v=>onUpdate({...block,alt:v})} placeholder="Descripción de la imagen"/>
      </>);
      case"cenefa":return(<>
        <ImgUploadField label="Imagen cenefa" value={block.imgUrl} onChange={v=>onUpdate({...block,imgUrl:v})} token={token}/>
        <Input label="URL destino (opcional)" value={block.linkUrl} onChange={v=>onUpdate({...block,linkUrl:v})} placeholder="Dejar vacío si no lleva link" mono/>
      </>);
      case"contador":return(<>
        <Input label="URL del timer (mmgo.io)" value={block.timerUrl} onChange={v=>onUpdate({...block,timerUrl:v})} placeholder="https://s.mmgo.io/t/DEMF/" mono/>
        <Input label="Texto" value={block.text} onChange={v=>onUpdate({...block,text:v})} placeholder="Comenzó la cuenta regresiva"/>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <label style={{fontSize:10,fontWeight:700,color:T.faint,textTransform:"uppercase",letterSpacing:"0.07em"}}>Color fondo</label>
          <input type="color" value={block.bgColor} onChange={e=>onUpdate({...block,bgColor:e.target.value})}
            style={{width:30,height:24,border:`1px solid ${T.line3}`,borderRadius:5,cursor:"pointer",background:"none",padding:0}}/>
          <span style={{fontFamily:"ui-monospace,monospace",fontSize:11,color:T.dim}}>{block.bgColor}</span>
        </div>
      </>);
      case"productos":{
        const items=block.items||[];
        const updateItem=(i,val)=>onUpdate({...block,items:items.map((it,idx)=>idx===i?val:it)});
        const removeItem=(i)=>onUpdate({...block,items:items.filter((_,idx)=>idx!==i)});
        const addItem=()=>onUpdate({...block,items:[...items,{imgUrl:"",linkUrl:"",alt:`Producto ${items.length+1}`}]});
        return(<>
          <div style={{display:"grid",gridTemplateColumns:items.length>2?"1fr 1fr 1fr":"1fr 1fr",gap:8,marginBottom:10}}>
            {items.map((item,i)=>(
              <div key={i} style={{minWidth:0}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
                  <span style={{fontSize:10,fontWeight:700,color:T.faint,letterSpacing:"0.07em"}}>PROD. {i+1}</span>
                  {items.length>1&&<button onClick={()=>removeItem(i)} style={{background:"none",border:0,color:T.faintest,cursor:"pointer",padding:0,display:"flex"}}><Ico d={I.x} size={11} w={2.6}/></button>}
                </div>
                <ImgUploadField value={item.imgUrl} onChange={v=>updateItem(i,{...item,imgUrl:v})} token={token} compact/>
                <Input value={item.linkUrl} onChange={v=>updateItem(i,{...item,linkUrl:v})} placeholder="URL destino" mono/>
              </div>
            ))}
          </div>
          {items.length<3&&(
            <button onClick={addItem}
              style={{height:40,border:`1.5px dashed ${T.accent}`,borderRadius:9,background:T.accentSoft,color:T.accent,fontSize:10.5,fontWeight:600,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:6,width:"100%",marginBottom:10}}>
              <Ico d={I.plus} size={16}/>Agregar producto
            </button>
          )}
        </>);}
      default:return null;
    }
  };

  return(
    <div {...dragProps}
      style={{borderRadius:12,background:hidden?T.card2:T.card,
        border:`1px solid ${expanded?T.accentLine:T.line2}`,
        boxShadow:dragging?`0 14px 26px ${T.shadow}`:expanded?`0 0 0 1px ${T.accentSoft}`:"none",
        opacity:dragging?.95:hidden?.6:1,transform:dragging?"rotate(-.6deg)":"none",transition:"border-color .15s"}}>
      <div onClick={onToggle}
        style={{display:"flex",alignItems:"center",gap:10,padding:"9px 10px",cursor:"pointer"}}>
        <span style={{cursor:"grab",display:"flex"}} onClick={e=>e.stopPropagation()}><Grip/></span>
        <div style={{display:"flex",gap:2,flexShrink:0}}>
          {thumbs.length?thumbs.map((src,i)=>(
            <img key={i} src={src} alt="" style={{width:thumbs.length>1?22:46,height:34,objectFit:"cover",background:"#fff",
              borderRadius:thumbs.length===1?5:i===0?"5px 0 0 5px":i===thumbs.length-1?"0 5px 5px 0":0}}/>
          )):(
            <div style={{width:46,height:34,borderRadius:5,background:`repeating-linear-gradient(45deg,${T.sk},${T.sk} 4px,${T.card2} 4px,${T.card2} 8px)`}}/>
          )}
        </div>
        <div style={{flex:1,minWidth:0}}>
          <div style={{display:"flex",alignItems:"center",gap:7}}>
            <span style={{fontSize:12.5,fontWeight:600,color:T.text}}>{typeInfo?.label.replace(" 100%","")}</span>
            <span style={{fontSize:10,fontWeight:700,letterSpacing:".04em",color:hidden?T.dim:badge.color,background:hidden?T.chip:`${badge.color}22`,padding:"2px 5px",borderRadius:4}}>
              {hidden?"OCULTO":badge.label}
            </span>
          </div>
          <div style={{fontSize:11,color:T.faint,marginTop:2,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>
            {hidden?"No se incluye en el envío":blockSummary(block)}
          </div>
        </div>
        <div style={{display:"flex",gap:1}} onClick={e=>e.stopPropagation()}>
          <IconButton title="Duplicar" onClick={onDuplicate}><Ico d={I.copy}/></IconButton>
          <IconButton title={hidden?"Mostrar":"Ocultar"} onClick={onToggleHidden}><Ico d={hidden?I.eyeOff:I.eye}/></IconButton>
          <IconButton title="Eliminar" onClick={onRemove} danger><Ico d={I.trash}/></IconButton>
          <IconButton title={expanded?"Colapsar":"Editar"} onClick={onToggle}><Ico d={expanded?I.chevronUp:I.chevronDown} w={2.4}/></IconButton>
        </div>
      </div>
      {expanded&&<div style={{padding:"14px 12px",borderTop:`1px solid ${T.line}`}}>{renderFields()}</div>}
    </div>
  );
}

// ─── Main App ───
const DRAFT_KEY="eb-draft-v1";
const THEME_KEY="eb-theme";

function App(){
  const[token,setToken]=useState(getStoredToken);
  const[showSetup,setShowSetup]=useState(!getStoredToken());
  const[setupToken,setSetupToken]=useState("");
  const[setupTesting,setSetupTesting]=useState(false);
  const[setupError,setSetupError]=useState("");
  const[showTokenField,setShowTokenField]=useState(false);

  const draft=(()=>{try{return JSON.parse(localStorage.getItem(DRAFT_KEY))||{}}catch(e){return{}}})();
  (draft.blocks||[]).forEach(b=>{
    const n=parseInt(String(b.id||"").slice(1),10);
    if(!Number.isNaN(n)&&n>_blockId)_blockId=n;
  });
  const seenIds=new Set();
  (draft.blocks||[]).forEach(b=>{
    if(!b.id||seenIds.has(b.id))b.id=uid();
    seenIds.add(b.id);
  });

  const[theme,setTheme]=useState(()=>localStorage.getItem(THEME_KEY)||"dark");
  const[selectedBrand,setSelectedBrand]=useState(draft.selectedBrand||"spring");
  const[campaignName,setCampaignName]=useState(draft.campaignName||"");
  const[preheader,setPreheader]=useState(draft.preheader||"");
  const[blocks,setBlocks]=useState(draft.blocks||[]);
  const[expandedId,setExpandedId]=useState(null);
  const[showBrandMenu,setShowBrandMenu]=useState(false);
  const brandBtnRef=useRef(null);
  const[device,setDevice]=useState("desktop");
  const[viewCode,setViewCode]=useState(false);
  const[copied,setCopied]=useState(false);
  const[savedAt,setSavedAt]=useState(null);
  const[tick,setTick]=useState(0);
  const[dragIndex,setDragIndex]=useState(null);
  const[dropIndex,setDropIndex]=useState(null);

  const history=useRef({past:[],future:[]});
  const skipHistory=useRef(false);

  useEffect(()=>{document.body.dataset.theme=theme;localStorage.setItem(THEME_KEY,theme);},[theme]);

  // autosave
  useEffect(()=>{
    const t=setTimeout(()=>{
      localStorage.setItem(DRAFT_KEY,JSON.stringify({selectedBrand,campaignName,preheader,blocks}));
      setSavedAt(Date.now());
    },600);
    return()=>clearTimeout(t);
  },[selectedBrand,campaignName,preheader,blocks]);

  useEffect(()=>{const i=setInterval(()=>setTick(t=>t+1),5000);return()=>clearInterval(i);},[]);

  const commit=(next)=>{
    history.current.past.push(blocks);
    if(history.current.past.length>50)history.current.past.shift();
    history.current.future=[];
    setBlocks(next);
  };
  const undo=()=>{
    const h=history.current;
    if(!h.past.length)return;
    h.future.push(blocks);
    setBlocks(h.past.pop());
  };
  const redo=()=>{
    const h=history.current;
    if(!h.future.length)return;
    h.past.push(blocks);
    setBlocks(h.future.pop());
  };

  useEffect(()=>{
    const onKey=(e)=>{
      const mod=e.metaKey||e.ctrlKey;
      if(!mod)return;
      if(e.key.toLowerCase()==="z"){e.preventDefault();e.shiftKey?redo():undo();}
    };
    window.addEventListener("keydown",onKey);
    return()=>window.removeEventListener("keydown",onKey);
  });

  // ─── Setup ───
  const handleConnect=async()=>{
    const t=setupToken.trim();
    if(!t.startsWith("ghp_")){setSetupError("El token debe empezar con ghp_");return;}
    setSetupTesting(true);setSetupError("");
    try{
      const res=await fetch(`https://api.github.com/repos/${GH_REPO}`,{headers:{"Authorization":`token ${t}`}});
      if(res.ok){storeToken(t);setToken(t);setShowSetup(false);}
      else setSetupError("Token inválido o sin acceso al repo devser8/email-assets");
    }catch(e){setSetupError("Error de conexión");}
    finally{setSetupTesting(false);}
  };
  const handleLogout=()=>{clearStoredToken();setToken("");setSetupToken("");setShowSetup(true);};

  // ─── Block handlers ───
  const addBlock=(type)=>{const b=createBlock(type);commit([...blocks,b]);setExpandedId(b.id);};
  const removeBlock=(i)=>commit(blocks.filter((_,idx)=>idx!==i));
  const duplicateBlock=(i)=>{
    const copy=JSON.parse(JSON.stringify(blocks[i]));copy.id=uid();
    const next=[...blocks];next.splice(i+1,0,copy);commit(next);
  };
  const updateBlock=(i,updated)=>{skipHistory.current=true;setBlocks(blocks.map((b,idx)=>idx===i?updated:b));};
  const toggleHidden=(i)=>commit(blocks.map((b,idx)=>idx===i?{...b,hidden:!b.hidden}:b));
  const moveBlock=(from,to)=>{
    if(to<0||to>blocks.length||from===to)return;
    const next=[...blocks];
    const[item]=next.splice(from,1);
    next.splice(from<to?to-1:to,0,item);
    commit(next);
  };

  const visibleBlocks=blocks.filter(b=>!b.hidden);
  const generated=useMemo(
    ()=>generateFullHTML(campaignName,preheader,visibleBlocks,selectedBrand),
    [campaignName,preheader,blocks,selectedBrand]
  );
  const sizeKB=Math.max(1,Math.round(new Blob([generated]).size/1024));
  const missingRequired=!campaignName.trim()||!preheader.trim();
  const warnings=[];
  blocks.forEach((b,i)=>{
    if((b.type==="banner"||b.type==="cenefa")&&!b.imgUrl&&!b.hidden)warnings.push(`Bloque #${i+1}: falta imagen`);
    if(b.type==="banner"&&b.imgUrl&&!b.alt&&!b.hidden)warnings.push(`Bloque #${i+1}: falta alt`);
    if(b.type==="productos"&&!b.hidden&&(b.items||[]).some(p=>!p.imgUrl))warnings.push(`Bloque #${i+1}: producto sin imagen`);
    if(b.type==="contador"&&!b.timerUrl&&!b.hidden)warnings.push(`Bloque #${i+1}: falta URL del timer`);
  });

  const handleCopy=()=>{navigator.clipboard.writeText(generated).then(()=>{setCopied(true);setTimeout(()=>setCopied(false),2200);});};
  const handleDownload=()=>{
    const blob=new Blob([generated],{type:"text/html"});
    const url=URL.createObjectURL(blob);
    const a=document.createElement("a");
    a.href=url;a.download=`${campaignName||"email"}.html`;a.click();
    URL.revokeObjectURL(url);
  };

  const savedLabel=(()=>{
    if(!savedAt)return "Borrador local";
    const s=Math.round((Date.now()-savedAt)/1000);
    return s<5?"Guardado":`Guardado hace ${s<60?s+" s":Math.round(s/60)+" min"}`;
  })();

  // ─── SETUP SCREEN ───
  if(showSetup){
    return(
      <div style={{height:"100vh",display:"flex",alignItems:"center",justifyContent:"center",padding:20,background:T.bg}} className="fade-in">
        <div style={{maxWidth:420,width:"100%"}}>
          <div style={{textAlign:"center",marginBottom:24}}>
            <div style={{width:48,height:48,borderRadius:14,background:"linear-gradient(145deg,#4a9eff,#2f6fd0)",display:"inline-flex",alignItems:"center",justifyContent:"center",marginBottom:12,color:"#fff"}}>
              <Ico d={I.mail} size={22}/>
            </div>
            <h1 style={{fontSize:22,fontWeight:800,margin:"0 0 4px",letterSpacing:"-0.02em",color:T.text}}>Email Builder</h1>
            <p style={{fontSize:12,color:T.faint,margin:0}}>Configuración inicial (solo una vez por navegador)</p>
          </div>
          <div style={{background:T.card,borderRadius:12,padding:20,border:`1px solid ${T.line2}`}}>
            <h3 style={{fontSize:13,fontWeight:700,margin:"0 0 12px",color:T.text,display:"flex",alignItems:"center",gap:7}}><Ico d={I.key}/> Token de GitHub</h3>
            <p style={{fontSize:11.5,color:T.faint,lineHeight:1.6,marginBottom:14}}>
              Para subir imágenes al repo necesitas un Personal Access Token. Se guarda solo en tu navegador.
            </p>
            <div style={{background:T.card2,borderRadius:8,padding:12,marginBottom:14,fontSize:10.5,color:T.faint,lineHeight:1.9,border:`1px solid ${T.line}`}}>
              <strong style={{color:T.accent}}>Cómo obtenerlo:</strong><br/>
              1. github.com → Settings<br/>
              2. Developer Settings → Personal Access Tokens → Tokens (classic)<br/>
              3. Generate new token → scope <strong style={{color:T.text}}>repo</strong><br/>
              4. Pégalo aquí ↓
            </div>
            <div style={{marginBottom:12}}>
              <label style={{display:"block",fontSize:10,fontWeight:700,color:T.faint,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:5}}>Token</label>
              <div style={{display:"flex",gap:6}}>
                <input type={showTokenField?"text":"password"} value={setupToken} onChange={e=>setSetupToken(e.target.value)}
                  placeholder="ghp_xxxxxxxxxxxxxxxxxxxx" onKeyDown={e=>{if(e.key==="Enter")handleConnect();}}
                  style={{flex:1,height:38,padding:"0 12px",fontSize:13,fontFamily:"ui-monospace,monospace",border:`1px solid ${T.line3}`,borderRadius:8,background:T.input,color:T.text,outline:"none",boxSizing:"border-box"}}/>
                <button onClick={()=>setShowTokenField(!showTokenField)}
                  style={{width:42,border:`1px solid ${T.line3}`,borderRadius:8,background:T.card2,color:T.faint,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>
                  <Ico d={showTokenField?I.eyeOff:I.eye}/>
                </button>
              </div>
            </div>
            {setupError&&<div style={{fontSize:11,color:"#ef4444",marginBottom:10,fontWeight:600}}>{setupError}</div>}
            <button onClick={handleConnect} disabled={!setupToken||setupTesting}
              style={{width:"100%",height:42,border:"none",borderRadius:9,fontSize:14,fontWeight:800,
                cursor:setupToken&&!setupTesting?"pointer":"not-allowed",
                background:setupToken?T.accent:T.chip,color:setupToken?T.accentFg:T.faintest}}>
              {setupTesting?"Verificando…":"Conectar →"}
            </button>
            <p style={{fontSize:9.5,color:T.faintest,marginTop:10,textAlign:"center",lineHeight:1.5}}>
              Se guarda en localStorage. Solo se envía a la API de GitHub.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const brand=BRANDS[selectedBrand];

  // ─── BUILDER ───
  return(
    <div style={{height:"100vh",display:"flex",flexDirection:"column",background:T.bg,color:T.text,fontSize:13}}>

      {/* Top bar */}
      <div style={{display:"flex",alignItems:"center",gap:12,padding:"0 16px",height:52,background:T.chrome,borderBottom:`1px solid ${T.line}`,flexShrink:0,position:"relative",zIndex:20,minWidth:0,overflowX:"auto",overflowY:"visible"}}>
        <div style={{display:"flex",alignItems:"center",gap:10,flexShrink:0}}>
          <div style={{width:26,height:26,borderRadius:7,background:"linear-gradient(145deg,#4a9eff,#2f6fd0)",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff"}}>
            <Ico d={I.mail} size={14}/>
          </div>
          <span style={{fontWeight:700,fontSize:14,letterSpacing:"-0.01em"}}>Email Builder</span>
        </div>

        <div style={{width:1,height:22,background:T.line2,flexShrink:0}}/>

        {/* Brand */}
        <div ref={brandBtnRef} style={{position:"relative",flexShrink:0}}>
          <button onClick={()=>setShowBrandMenu(!showBrandMenu)}
            style={{display:"flex",alignItems:"center",gap:9,height:32,padding:"0 10px 0 8px",border:`1px solid ${T.line3}`,borderRadius:8,background:T.card,color:T.text,fontSize:13,fontWeight:600,cursor:"pointer"}}>
            <span style={{width:8,height:8,borderRadius:"50%",background:brand?.color}}/>
            {brand?.label}
            {brand?.pending&&<span style={{fontSize:9.5,color:"#f59e0b",fontWeight:700}}>pendiente</span>}
            <span style={{opacity:.55,display:"flex"}}><Ico d={I.chevronDown} size={12} w={2.5}/></span>
          </button>
        </div>
        {showBrandMenu&&(
          <FloatingMenu anchorRef={brandBtnRef} width={240} style={{padding:6,display:"flex",flexDirection:"column",gap:2}}>
            {Object.entries(BRANDS).map(([key,b])=>(
              <button key={key} onClick={()=>{setSelectedBrand(key);setShowBrandMenu(false);}}
                style={{display:"flex",alignItems:"center",gap:9,height:32,padding:"0 8px",border:0,borderRadius:7,
                  background:key===selectedBrand?T.hover:"transparent",color:T.text,fontSize:12.5,fontWeight:600,cursor:"pointer",textAlign:"left"}}>
                <span style={{width:8,height:8,borderRadius:"50%",background:b.color}}/>
                <span style={{flex:1}}>{b.label}</span>
                {b.pending&&<span style={{fontSize:9.5,color:"#f59e0b",fontWeight:700}}>pendiente</span>}
                {key===selectedBrand&&<span style={{color:T.accent,display:"flex"}}><Ico d={I.check} size={12}/></span>}
              </button>
            ))}
          </FloatingMenu>
        )}

        <div style={{flex:1}}/>

        <div style={{display:"flex",alignItems:"center",gap:6,height:26,padding:"0 9px",borderRadius:999,background:"rgba(16,185,129,.10)",border:"1px solid rgba(16,185,129,.28)",color:"#0f9d6e",fontSize:11.5,fontWeight:600,flexShrink:0,whiteSpace:"nowrap"}}>
          <span style={{width:6,height:6,borderRadius:"50%",background:"#10b981",flexShrink:0}}/>
          {savedLabel}
        </div>

        {/* Theme */}
        <div style={{display:"flex",gap:2,padding:3,background:T.card2,border:`1px solid ${T.line}`,borderRadius:9,flexShrink:0}}>
          {[["light",I.sun,"Modo claro"],["dark",I.moon,"Modo oscuro"]].map(([k,ic,title])=>(
            <button key={k} title={title} onClick={()=>setTheme(k)}
              style={{width:28,height:26,display:"flex",alignItems:"center",justifyContent:"center",border:0,borderRadius:6,cursor:"pointer",
                background:theme===k?T.hover2:"transparent",color:theme===k?T.text:T.faintest}}>
              <Ico d={ic} size={14}/>
            </button>
          ))}
        </div>

        {/* Undo / redo */}
        <div style={{display:"flex",gap:2,padding:3,background:T.card2,border:`1px solid ${T.line}`,borderRadius:9,flexShrink:0}}>
          <IconButton title="Deshacer (⌘Z)" onClick={undo} disabled={!history.current.past.length}><Ico d={I.undo} size={14}/></IconButton>
          <IconButton title="Rehacer (⇧⌘Z)" onClick={redo} disabled={!history.current.future.length}><Ico d={I.redo} size={14}/></IconButton>
        </div>

        <a href={`https://github.com/${GH_REPO}/tree/main/img`} target="_blank" rel="noopener" title="Imágenes en el repo"
          style={{display:"flex",alignItems:"center",justifyContent:"center",width:32,height:32,flexShrink:0,border:`1px solid ${T.line3}`,borderRadius:8,background:T.card,color:T.faint}}>
          <Ico d={I.folder}/>
        </a>
        <button onClick={handleLogout} title="Cambiar token"
          style={{display:"flex",alignItems:"center",justifyContent:"center",width:32,height:32,flexShrink:0,border:`1px solid ${T.line3}`,borderRadius:8,background:T.card,color:T.faint,cursor:"pointer"}}>
          <Ico d={I.key}/>
        </button>

        <button onClick={handleDownload} disabled={missingRequired}
          title={missingRequired?"Completa nombre de campaña y preheader antes de descargar":undefined}
          style={{display:"flex",alignItems:"center",gap:7,height:32,padding:"0 12px",flexShrink:0,border:`1px solid ${T.line3}`,borderRadius:8,background:T.card,color:T.text,fontSize:12.5,fontWeight:600,cursor:missingRequired?"not-allowed":"pointer",whiteSpace:"nowrap",opacity:missingRequired?.45:1}}>
          <span style={{color:T.dim,display:"flex"}}><Ico d={I.download}/></span> Descargar
        </button>
        <button onClick={handleCopy} disabled={missingRequired}
          title={missingRequired?"Completa nombre de campaña y preheader antes de copiar":undefined}
          style={{display:"flex",alignItems:"center",gap:7,height:32,padding:"0 14px",flexShrink:0,border:0,borderRadius:8,whiteSpace:"nowrap",
            background:copied?"#10b981":T.accent,color:copied?"#fff":T.accentFg,fontSize:12.5,fontWeight:700,cursor:missingRequired?"not-allowed":"pointer",transition:"background .2s",opacity:missingRequired?.45:1}}>
          <Ico d={copied?I.check:I.copy} w={2.4}/> {copied?"Copiado":"Copiar HTML"}
        </button>
      </div>

      <div style={{flex:1,display:"flex",minHeight:0}} onClick={()=>{setShowBrandMenu(false);}}>

        {/* Left: blocks */}
        <div style={{width:396,flexShrink:0,display:"flex",flexDirection:"column",background:T.chrome,borderRight:`1px solid ${T.line}`,minHeight:0}}>
          <div style={{padding:"14px 16px",borderBottom:`1px solid ${T.line}`}}>
            <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:10}}>
              <span style={{fontSize:13,fontWeight:700}}>Datos de campaña</span>
              <span style={{fontSize:9.5,fontWeight:700,color:"#ef4444",background:"rgba(239,68,68,.1)",border:"1px solid rgba(239,68,68,.3)",borderRadius:999,padding:"1px 7px"}}>Obligatorio</span>
            </div>
            <Input label="Nombre campaña (slug UTM)" value={campaignName} onChange={setCampaignName} placeholder="gran-sale-190126" mono required/>
            <div style={{background:T.input,borderRadius:6,padding:"7px 10px",fontSize:10,color:T.faintest,fontFamily:"ui-monospace,monospace",wordBreak:"break-all",marginBottom:10}}>
              utm_source=mailing&utm_medium=mailing&utm_campaign=<span style={{color:T.accent}}>{campaignName||"…"}</span>
            </div>
            <Input label="Preheader" value={preheader} onChange={setPreheader} placeholder="Texto oculto en bandeja de entrada" required/>
          </div>

          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"14px 16px 10px"}}>
            <div style={{display:"flex",alignItems:"baseline",gap:8}}>
              <span style={{fontSize:13,fontWeight:700}}>Bloques</span>
              <span style={{fontSize:11.5,color:T.faintest}}>{blocks.length} · {sizeKB} KB aprox.</span>
            </div>
            {blocks.length>0&&(
              <button onClick={()=>setExpandedId(null)}
                style={{display:"flex",alignItems:"center",gap:6,height:24,padding:"0 8px",border:`1px solid ${T.line2}`,borderRadius:6,background:"transparent",color:T.dim,fontSize:11.5,fontWeight:600,cursor:"pointer"}}>
                <Ico d={I.chevronUp} size={12}/> Colapsar todo
              </button>
            )}
          </div>

          <div style={{flex:1,overflowY:"auto",padding:"0 12px 16px",display:"flex",flexDirection:"column",gap:2}}
            onDragOver={e=>e.preventDefault()}>

            {blocks.length===0&&(
              <div style={{textAlign:"center",padding:"34px 20px",color:T.faint,border:`1.5px dashed ${T.line2}`,borderRadius:12,marginBottom:8}}>
                <p style={{fontSize:13,margin:0,fontWeight:600,color:T.dim}}>Tu email está vacío</p>
                <p style={{fontSize:11.5,margin:"4px 0 0",color:T.faintest}}>Elige un bloque abajo para empezar</p>
              </div>
            )}

            {blocks.map((block,i)=>(
              <React.Fragment key={block.id}>
                <div onDragOver={e=>{e.preventDefault();setDropIndex(i);}}
                  style={{height:14,display:"flex",alignItems:"center",justifyContent:"center",position:"relative"}}>
                  {dragIndex!==null&&dropIndex===i?(
                    <>
                      <div style={{position:"absolute",left:8,right:8,height:2,borderRadius:2,background:T.accent}}/>
                      <div style={{position:"absolute",left:4,width:8,height:8,borderRadius:"50%",background:T.accent}}/>
                    </>
                  ):i>0?(
                    <div style={{position:"absolute",left:8,right:8,height:1,background:T.line}}/>
                  ):null}
                </div>
                <BlockCard
                  block={block} index={i} token={token}
                  expanded={expandedId===block.id}
                  onToggle={()=>setExpandedId(expandedId===block.id?null:block.id)}
                  onUpdate={b=>updateBlock(i,b)}
                  onRemove={()=>removeBlock(i)}
                  onDuplicate={()=>duplicateBlock(i)}
                  onToggleHidden={()=>toggleHidden(i)}
                  dragging={dragIndex===i}
                  dragProps={{
                    draggable:true,
                    onDragStart:()=>{setDragIndex(i);setExpandedId(null);},
                    onDragEnd:()=>{
                      if(dragIndex!==null&&dropIndex!==null)moveBlock(dragIndex,dropIndex);
                      setDragIndex(null);setDropIndex(null);
                    },
                    onDragOver:e=>{
                      e.preventDefault();
                      const r=e.currentTarget.getBoundingClientRect();
                      setDropIndex(e.clientY<r.top+r.height/2?i:i+1);
                    }
                  }}
                />
              </React.Fragment>
            ))}

            {dragIndex!==null&&dropIndex===blocks.length&&(
              <div style={{height:14,position:"relative"}}>
                <div style={{position:"absolute",top:6,left:8,right:8,height:2,borderRadius:2,background:T.accent}}/>
              </div>
            )}

            {/* Block picker */}
            <div style={{marginTop:12,border:`1px solid ${T.line2}`,borderRadius:12,background:T.card2,padding:12,display:"flex",flexDirection:"column",gap:10}}>
              <span style={{fontSize:10.5,fontWeight:700,letterSpacing:".07em",color:T.faint}}>AGREGAR BLOQUE</span>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                {BLOCK_TYPES.map(bt=>(
                  <button key={bt.key} onClick={()=>addBlock(bt.key)}
                    onMouseEnter={e=>e.currentTarget.style.borderColor="var(--accent)"}
                    onMouseLeave={e=>e.currentTarget.style.borderColor="var(--line-3)"}
                    style={{display:"flex",flexDirection:"column",gap:8,padding:10,border:`1px solid ${T.line3}`,borderRadius:10,background:T.card,cursor:"pointer",textAlign:"left",color:T.text,transition:"border-color .15s"}}>
                    <div style={{height:30,borderRadius:5,background:T.sk,display:"flex",alignItems:"center",justifyContent:"center",gap:bt.key==="productos"?4:3}}>
                      {bt.key==="banner"&&<div style={{width:"80%",height:12,borderRadius:2,background:T.sk2}}/>}
                      {bt.key==="cenefa"&&<div style={{width:"80%",height:5,borderRadius:2,background:T.sk2}}/>}
                      {bt.key==="productos"&&[0,1,2].map(n=><div key={n} style={{width:20,height:16,borderRadius:2,background:T.sk2}}/>)}
                      {bt.key==="contador"&&[0,1,2].map(n=><div key={n} style={{width:14,height:16,borderRadius:2,background:T.sk2}}/>)}
                    </div>
                    <div>
                      <div style={{fontSize:12,fontWeight:600}}>{bt.label.replace(" 100%","")}</div>
                      <div style={{fontSize:10.5,color:T.faint,marginTop:1}}>{bt.desc}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right: preview */}
        <div style={{flex:1,display:"flex",flexDirection:"column",minWidth:0,background:T.canvas}}>
          <div style={{display:"flex",alignItems:"center",gap:10,padding:"0 16px",height:44,borderBottom:`1px solid ${T.line}`,flexShrink:0}}>
            <div style={{display:"flex",gap:2,padding:3,background:T.card2,border:`1px solid ${T.line}`,borderRadius:9}}>
              {[["desktop",I.desktop,"Escritorio"],["mobile",I.mobile,"Móvil"]].map(([k,ic,label])=>(
                <button key={k} onClick={()=>setDevice(k)}
                  style={{display:"flex",alignItems:"center",gap:6,height:26,padding:"0 10px",border:0,borderRadius:6,cursor:"pointer",
                    background:device===k?T.hover2:"transparent",color:device===k?T.text:T.dim,fontSize:12,fontWeight:600}}>
                  <Ico d={ic}/> {label}
                </button>
              ))}
            </div>

            <div style={{display:"flex",gap:2,padding:3,background:T.card2,border:`1px solid ${T.line}`,borderRadius:9}}>
              {[[false,"Preview"],[true,"Código"]].map(([v,label])=>(
                <button key={label} onClick={()=>setViewCode(v)}
                  style={{height:26,padding:"0 10px",border:0,borderRadius:6,cursor:"pointer",
                    background:viewCode===v?T.hover2:"transparent",color:viewCode===v?T.text:T.dim,fontSize:12,fontWeight:600}}>
                  {label}
                </button>
              ))}
            </div>

            <div style={{flex:1}}/>

            {warnings.length>0&&(
              <div title={warnings.join("\n")}
                style={{display:"flex",alignItems:"center",gap:7,height:26,padding:"0 10px",borderRadius:999,
                  background:"rgba(245,158,11,.12)",border:"1px solid rgba(245,158,11,.28)",color:"#b45309",fontSize:11.5,fontWeight:600,cursor:"default"}}>
                <Ico d={I.alert} size={12} w={2.2}/>
                {warnings.length} aviso{warnings.length!==1?"s":""}: {warnings[0]}
              </div>
            )}
            <span style={{fontSize:11.5,color:T.faintest}}>{device==="mobile"?"375":"600"} px · {sizeKB} KB</span>
          </div>

          {viewCode?(
            <pre style={{margin:0,padding:16,fontSize:11,lineHeight:1.6,color:T.dim,overflow:"auto",flex:1,fontFamily:"ui-monospace,'SF Mono',monospace",whiteSpace:"pre-wrap",wordBreak:"break-all"}}>{generated}</pre>
          ):(
            <div style={{flex:1,overflow:"auto",display:"flex",alignItems:"flex-start",padding:"26px 20px 40px"}}>
              {(()=>{
                const renderW=620,mobileScale=375/renderW;
                return(
                  <div style={{width:device==="mobile"?375:renderW,height:device==="mobile"?1200*mobileScale:1200,margin:"0 auto",flexShrink:0,background:"#fff",borderRadius:6,overflow:"hidden",boxShadow:`0 24px 60px ${T.shadow}`}}>
                    <iframe srcDoc={generated} title="Preview" sandbox="allow-same-origin"
                      style={{width:renderW,height:1200,border:"none",display:"block",background:"#fff",
                        transform:device==="mobile"?`scale(${mobileScale})`:"none",transformOrigin:"top left"}}/>
                  </div>
                );
              })()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App/>);

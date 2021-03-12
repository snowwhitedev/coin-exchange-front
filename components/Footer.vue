<template>
  <div class="footer">
    <div class="footer-body">
      <div class="container">
        <a-row type="flex" class="footer-row">
          <a-col>
            <h3 class="list-heading">Ürünler</h3>
            <ul>
              <li>
                <a href="/trade">Cointral | Borsa</a>
              </li>
              <li>
                <a href="">Cointral | Şube</a>
              </li>
              <li>
                <a href="#">Cointral | Nakit</a>
              </li>
              <li>
                <a href="https://cointral.store">Cointral | Altın</a>
              </li>
              <li>
                <a href="/otc">Cointral | OTC</a>
              </li>
              <li>
                <a href="#">Cointral | P2P</a>
              </li>
              <li>
                <a href="/buy-crypto">Cointral | Kredi Kartı</a>
              </li>
              <li>
                <a href="https://swap.cointral.com">Cointral | SWAP</a>
              </li>
              <li>
                <a href="https://realty.cointral.com">Cointral | Gayrimenkul</a>
              </li>
              <li>
                <a href="#">Cointral | Kurumsal</a>
              </li>
            </ul>
          </a-col>
          <a-col>
            <h3 class="list-heading">Kurumsal</h3>
            <ul>
                <li>
                  <a href="#">Hakkımızda</a>
                </li>
                <li>
                  <a href="#">Neden Cointral?</a>
                </li>
                <li>
                  <a href="https://cointral.zendesk.com/hc/tr/requests/new"
                    >İletişim</a
                  >
              
              <li></li>
              <h3 class="list-heading">Yasal Bilgiler</h3>
                </li><li>
                <a href="https://cointral.com/tr/kullanim-kosulu/"
                  >Kullanıcı Sözleşmesi</a
                >
              </li>
              <li>
                <a href="https://cointral.com/tr/kvkk-ve-aydinlatma-metni/"
                  >Kişisel Verilerin Korunması</a
                >
              </li>
              <li>
                <a
                  href="https://cointral.com/tr/suc-gelirlerinin-aklanmasinin-ve-terorun-finansmaninin-onlenmesi-hakkinda-politika/"
                  >SGA-TF Önlenmesi</a >
              </li>
              <li>
                <a href="https://cointral.com/tr/musterini-tani-politikasi/"
                  >Müşterini Tanıma Esasları</a>
              </li>
              </ul>
            </ul>
          </a-col>
          <a-col>
            <h3 class="list-heading">Bilgi Merkezi</h3>
            <ul>
              <li>
                <a href="https://cointral.com/tr/category/blog/">Blog</a>
              </li>
              <li>
                <a href="https://cointral.com/tr/category/haberler/"
                  >Haberler</a
                >
              </li>
              <li>
                <a
                  href="https://cointral.com/tr/category/gunluk-kripto-para-bulteni/"
                  >Günlük Bülten</a
                ><li>
                </li>
              <h3 class="list-heading">Satın Al</h3>
              <ul>
                <li>
                  <a href="https://cointral.com/tr/bitcoin-satin-al/">Bitcoin Satın Al</a>
                </li>
                <li>
                  <a href="https://cointral.com/tr/ethereum-satin-al/">Ethereum Satın Al</a>
                </li>
                <li>
                  <a href="https://cointral.com/tr/tether-satin-al/">USDT Tether Satın Al</a
                  >
                </li>
                <li>
                  <a href="https://cointral.com/tr/litecoin-satin-al/">Litecoin Satın Al</a>
                </li><li>
                  <a href="https://cointral.com/tr/ripple-satin-al/">Ripple Satın Al</a>
                </li>
              </ul>
              </li>
            </ul>
          </a-col>
          <a-col class="list-end">
            <h3 class="list-heading">Destek</h3>
            <ul>
              <li>
                <a href="https://cointral.zendesk.com/hc/tr">Destek Merkezi</a>
              </li>
              <li>
                <a href="#">Limitler</a>
              </li>
              <li>
                <a href="https://cointral.com/tr/komisyon-oranlari/"
                  >Komisyonlar</a
                >
              </li>
              <li>
                <a href="https://cointral.com/tr/cointral-hesabinizin-guvenligini-artirmak-icin-yapmaniz-gereken-4-adim/">Güvenlik</a>
              </li>
            </ul>
          </a-col>
          <a-col class="list-end">
            <h3 class="list-heading">Topluluk</h3>
            <div>
              <div class="list-social-media">
                <div class="list-social-media-item">
                  <a target="_blank" href="https://twitter.com/Cointral/"><a-icon type="twitter" /></a>
                </div>
                <div class="list-social-media-item">
                  <a target="_blank" href="https://t.me/cointral/"><a-icon type="mail" /></a>
                </div>
                <div class="list-social-media-item">
                  <a target="_blank" href="https://www.facebook.com/Cointral/"><a-icon type="facebook" /></a>
                </div>
                <div class="list-social-media-item">
                  <a target="_blank" href="https://www.youtube.com/cointral/"><a-icon type="youtube" /></a>
                </div>
                 <div class="list-social-media-item">
                  <a target="_blank" href="https://linkedin.com/company/Cointral/"><a-icon type="linkedin" /></a>
                </div> <div class="list-social-media-item">
                  <a target="_blank" href="https://instagram.com/Cointral/"><a-icon type="instagram" /></a>
                </div>
              </div>
              <a-select
                :default-value="$i18n.locale"
                class="select-outline select-outline-light-primary select-language select-white"
              >
                <a-select-option
                  v-for="(lang, item) in $i18n.locales"
                  :key="item"
                  :value="lang.code"
                  @click="$i18n.setLocale(lang.code)"
                >
                  {{ lang.name }}
                </a-select-option>
              </a-select>
            </div>
          </a-col>
        </a-row>
      </div>
    </div>
    <div class="footer-bottom">
      <span> | Tüm Hakları Saklıdır | © 2018 Cointral | Blockchain Lab Yazılım A.Ş Mersis No: 0178132817200001 | Fulya Mah. Büyükdere Cad. No:76 Quasar 34394 Şişli, İstanbul - TÜRKİYE |</span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '~/assets/scss/breakpoints.scss';

.footer {
  position: relative;
  bottom: 0;
  background: #0d1115;
  width: 100%;
  // margin-top: 20px;

  .footer-body {
    padding: 40px 0;
    border-bottom: 1px solid #1e2841;

    .select-language {
      width: 100px;
      margin-left: 10px;

      @include bp(tablet) {
        margin-left: 0;
      }
    }

    .footer-row {
      justify-content: space-between;
      width: 100%;
      @include bp(tablet) {
        flex-direction: column;

        .list-end {
          align-items: flex-start;

          ul li {
            text-align: left;
          }

          .list-social-media-item {
            justify-content: flex-start;
          }
        }
      }
    }

    .list-social-media {
      display: flex;
      flex-wrap: wrap;

      &-item {
        flex: 50%;
        display: flex;
        align-items: center;
        margin-bottom: 30px;
      }
    }

    .list-heading {
      color: #ffffff;
      margin-bottom: 1.2rem;
    }

    .list-end {
      display: flex;
      flex-direction: column;
    }

    ul {
      padding: 0;
      margin: 0;
      list-style: none;
      display: flex;
      flex-direction: column;

      li {
        margin-bottom: 1rem;
        a {
          color: #9caece;
        }
      }
    }
  }

  .footer-bottom {
    width: 100%;
    padding: 30px 0;
    color: #9daecc;
    display: flex;
    justify-content: center;
  }
}
</style>

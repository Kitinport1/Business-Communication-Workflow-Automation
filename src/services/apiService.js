// Serviço centralizado para todas as APIs públicas
class ApiService {
  constructor() {
    // Suas chaves de API (use variáveis de ambiente)
    this.NEWS_API_KEY = process.env.REACT_APP_NEWS_API_KEY || 'demo';
    this.WEATHER_API_KEY = process.env.REACT_APP_WEATHER_API_KEY || 'demo';
    this.SLACK_WEBHOOK = process.env.REACT_APP_SLACK_WEBHOOK;
  }

  // 📰 News API
  async getNews() {
    try {
      const response = await fetch(
        `https://newsapi.org/v2/top-headlines?category=technology&apiKey=${this.NEWS_API_KEY}`
      );
      const data = await response.json();
      
      return data.articles?.slice(0, 5).map(article => ({
        title: article.title,
        source: article.source.name,
        url: article.url,
        time: new Date(article.publishedAt).toLocaleTimeString()
      })) || [];
    } catch (error) {
      console.error('News API error:', error);
      // Fallback data
      return [
        { title: 'AI Revolution in Business Automation', source: 'TechCrunch', time: '2 hours ago' },
        { title: 'New Features in React 18', source: 'Dev.to', time: '5 hours ago' },
        { title: 'Top 10 Workflow Automation Tools', source: 'Forbes', time: '1 day ago' }
      ];
    }
  }

  // 🌤️ OpenWeatherMap API
  async getWeather(city) {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${this.WEATHER_API_KEY}`
      );
      const data = await response.json();
      
      return {
        city: data.name,
        temp: Math.round(data.main.temp),
        humidity: data.main.humidity,
        wind: data.wind.speed,
        description: data.weather[0].description,
        icon: data.weather[0].icon
      };
    } catch (error) {
      console.error('Weather API error:', error);
      // Fallback data
      return {
        city: 'São Paulo',
        temp: 24,
        humidity: 65,
        wind: 12,
        description: 'Partly cloudy'
      };
    }
  }

  // 💰 CoinGecko API (Crypto)
  async getCryptoPrices() {
    try {
      const response = await fetch(
        'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,cardano&vs_currencies=usd&include_24hr_change=true'
      );
      const data = await response.json();
      
      return [
        { name: 'Bitcoin', price: data.bitcoin.usd, change24h: data.bitcoin.usd_24h_change, image: 'https://cryptologos.cc/logos/bitcoin-btc-logo.png' },
        { name: 'Ethereum', price: data.ethereum.usd, change24h: data.ethereum.usd_24h_change, image: 'https://cryptologos.cc/logos/ethereum-eth-logo.png' },
        { name: 'Cardano', price: data.cardano.usd, change24h: data.cardano.usd_24h_change, image: 'https://cryptologos.cc/logos/cardano-ada-logo.png' }
      ];
    } catch (error) {
      console.error('Crypto API error:', error);
      // Fallback data
      return [
        { name: 'Bitcoin', price: 42500, change24h: 2.5 },
        { name: 'Ethereum', price: 2250, change24h: -1.2 },
        { name: 'Cardano', price: 0.45, change24h: 5.7 }
      ];
    }
  }

  // ✉️ SendGrid Email API
  async sendEmail(to, subject, message) {
    try {
      // Implementar integração com SendGrid
      console.log('Sending email:', { to, subject, message });
      return { success: true };
    } catch (error) {
      console.error('Email error:', error);
      return { success: false, error: error.message };
    }
  }

  // 💬 Slack Webhook
  async sendSlackMessage(channel, message) {
    try {
      if (this.SLACK_WEBHOOK) {
        const response = await fetch(this.SLACK_WEBHOOK, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ channel, text: message })
        });
        return { success: response.ok };
      }
      // Simulação
      console.log('Slack message:', { channel, message });
      return { success: true };
    } catch (error) {
      console.error('Slack error:', error);
      return { success: false, error: error.message };
    }
  }

  // 📱 Twilio WhatsApp API
  async sendWhatsApp(to, message) {
    try {
      // Implementar integração com Twilio
      console.log('WhatsApp message:', { to, message });
      return { success: true };
    } catch (error) {
      console.error('WhatsApp error:', error);
      return { success: false, error: error.message };
    }
  }

  // ✈️ Telegram Bot API
  async sendTelegramMessage(chatId, message) {
    try {
      const TELEGRAM_TOKEN = process.env.REACT_APP_TELEGRAM_TOKEN;
      const response = await fetch(
        `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chat_id: chatId, text: message })
        }
      );
      return { success: response.ok };
    } catch (error) {
      console.error('Telegram error:', error);
      return { success: false, error: error.message };
    }
  }

  // 📅 Google Calendar API (exemplo)
  async createCalendarEvent(eventData) {
    try {
      // Implementar integração com Google Calendar
      console.log('Creating calendar event:', eventData);
      return { success: true };
    } catch (error) {
      console.error('Calendar error:', error);
      return { success: false, error: error.message };
    }
  }
}

export default new ApiService();
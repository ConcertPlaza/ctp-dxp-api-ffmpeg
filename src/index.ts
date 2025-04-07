import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import { cors } from 'hono/cors';
import { prettyJSON } from 'hono/pretty-json';
import { fetchMetadata } from './services';

const app = new Hono();

type Bindings = {
  USERNAME: string;
  PASSWORD: string;
};

type RadioStation = {
  url: string;
};

const api = new Hono<{ Bindings: Bindings }>();
api.use('/ffmpeg/*', cors());

app.get('/', (c) => c.text('Pretty Blog API'));
app.use(prettyJSON());
app.notFound((c) => c.json({ message: 'Not Found', ok: false }, 404));

app.get('/', (c) => {
  return c.text('Hello Hono!');
});

api.post('/ffmpeg', async (c) => {
  const radioStation = await c.req.json<RadioStation>();
  const metadata = await fetchMetadata(radioStation.url);

  return c.json({ metadata });
});

app.route('/api', api);

serve(app);

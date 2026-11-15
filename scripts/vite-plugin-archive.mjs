// `import archive from 'virtual:sunya-archive'`로 아카이브 데이터를 앱에 넣는다.
// 개발 중에는 content/와 public/archive/를 지켜보다가 바뀌면 다시 만들고 새로고침한다.
import path from 'node:path';
import { buildArchive } from './lib/generate.mjs';
import { CONTENT_DIR, PUBLIC_DIR } from './lib/config.mjs';

const ID = 'virtual:sunya-archive';
const RESOLVED = '\0' + ID;

export default function sunyaArchive() {
  let pending = null;
  let server = null;
  const log = (msg) => (server ? server.config.logger.info(msg) : console.log(msg));

  const build = () => {
    pending ??= buildArchive({ log });
    return pending;
  };

  return {
    name: 'sunya-archive',
    async buildStart() {
      // 빌드: public/_gen이 dist로 복사되기 전에 모두 만들어 둔다
      if (!server) await build();
    },
    resolveId(id) {
      if (id === ID) return RESOLVED;
    },
    async load(id) {
      if (id !== RESOLVED) return;
      const data = await build();
      return `export default ${JSON.stringify(data)};`;
    },
    configureServer(s) {
      server = s;
      const watched = [CONTENT_DIR, path.join(PUBLIC_DIR, 'archive')];
      s.watcher.add(watched);
      let timer;
      const onChange = (file) => {
        if (!watched.some((dir) => file.startsWith(dir))) return;
        clearTimeout(timer);
        timer = setTimeout(async () => {
          pending = null;
          try {
            await build();
          } catch (e) {
            s.config.logger.error(e.message);
          }
          const mod = s.moduleGraph.getModuleById(RESOLVED);
          if (mod) s.moduleGraph.invalidateModule(mod);
          s.ws.send({ type: 'full-reload' });
        }, 150);
      };
      s.watcher.on('add', onChange);
      s.watcher.on('change', onChange);
      s.watcher.on('unlink', onChange);
    },
  };
}

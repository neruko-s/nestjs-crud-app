FROM ghcr.io/neruko-s/nestjs-crud-app-dep:latest AS BUILD_IMAGE

WORKDIR /usr/src/app

COPY . .

RUN npx prisma generate

RUN npm run build

RUN npm prune --production

RUN /usr/local/bin/node-prune

# ===============================================
FROM ghcr.io/neruko-s/node-base:latest

USER 1000
RUN mkdir -p /home/node/app/{node_modules,dist,prisma}
RUN chown -R 1000:1000 /home/node/app/

WORKDIR /home/node/app

COPY --from=BUILD_IMAGE /usr/src/app/dist /home/node/app/dist
COPY --from=BUILD_IMAGE /usr/src/app/node_modules /home/node/app/node_modules
COPY --from=BUILD_IMAGE /usr/src/app/prisma /home/node/app/prisma

EXPOSE 3000
ENTRYPOINT [ "node" ]
CMD [ "/home/node/app/dist/main.js" ]

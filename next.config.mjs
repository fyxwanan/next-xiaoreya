/** @type {import('next').NextConfig} */
import path from 'path';
import { fileURLToPath } from "url";
import withAntdLess from 'next-plugin-antd-less';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// next.config.mjs
const nextConfig = {
    reactStrictMode: true,
    // lessVarsFilePath: path.resolve(__dirname),
    // webpack: (config, { isServer }) => {
    //     const existingRules = config.module.rules;

    //     const cssRule = {
    //         test: /\.css$/,
    //         use: [
    //             { loader: 'css-loader' },
    //             { loader: 'postcss-loader' },
    //         ],
    //         include: path.resolve(__dirname, "app"),
    //         exclude: /node_modules/,
    //     };

    //     const lessRule = {
    //         test: /\.less$/,
    //         use: [
    //             { loader: 'style-loader' },
    //             { loader: 'css-loader' },
    //             { loader: 'less-loader' },
    //         ],
    //         include: path.resolve(__dirname, 'app'),
    //         exclude: /node_modules/,
    //     };

    //     const thirdPartyCssRule = {
    //         test: /\.css$/,
    //         use: [
    //             { loader: 'css-loader' },
    //             { loader: 'postcss-loader' },
    //         ],
    //         include: /node_modules/,
    //     };

    //     config.module.rules = [...existingRules, cssRule, lessRule, thirdPartyCssRule];
    //     return config;
    // },
};

// export default withAntdLess(nextConfig);
export default nextConfig;


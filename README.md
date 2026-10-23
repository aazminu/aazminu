## Abdullah Azmi
[![CV / Resume](https://img.shields.io/badge/CV_%2F_Resume-PDF-4A5568?style=flat-square)](https://abdullahazmi.com/assets/abdullah-azmi-resume.pdf) 

### Computational Genomics & Agentic Systems (CGAS) Lab · Northwestern University (CS & NICO)

[![Portfolio](https://img.shields.io/badge/Portfolio-abdullahazmi.com-5B6437?style=flat-square)](https://abdullahazmi.com/)
[![CGAS Lab](https://img.shields.io/badge/Research_Lab-abdullahazmi.com%2Flab-3A2A1C?style=flat-square)](https://abdullahazmi.com/lab/)
[![Workbench](https://img.shields.io/badge/Interactive_Workbench-4_Live_Simulations-2E4057?style=flat-square)](https://abdullahazmi.com/#workbench)
[![ORCID](https://img.shields.io/badge/ORCID-0009--0004--8172--6394-A6CE39?style=flat-square&logo=orcid)](https://orcid.org/0009-0004-8172-6394)

- **Affiliations:** Department of Computer Science & Northwestern Institute on Complex Systems (NICO), McCormick School of Engineering, Northwestern University (Evanston, IL & New York, NY)
- **Research & Engineering Focus:** Scientific Knowledge Graphs & Multi-Agent Verification, Regulatory Genomics & Non-Coding Variant Attribution, Calibrated Bayesian State-Space Inference, and High-Reliability Distributed Full-Stack Systems

---

### I. CGAS Lab Flagship Scientific Software (`github.com/aazminu`)

| Repository | Domain | Architecture & Empirical Benchmarks |
| :--- | :--- | :--- |
| **[`aazminu/paper-pulse`](https://github.com/aazminu/paper-pulse)** | Autonomous Scientific Knowledge Graphs | Nightly ingestion across **ArXiv, Semantic Scholar, PubMed & OpenAlex**; hybrid **PostgreSQL (`pgvector`)** dense retrieval + **Neo4j** multi-hop citation-concept property graph; deterministic claim provenance & daily audio synthesis. |
| **[`aazminu/chrom-alphagenome`](https://github.com/aazminu/chrom-alphagenome)** | Regulatory Genomics & Variant Attribution | Integrates **AlphaGenome Atlas** 3D cis-regulatory tracks, base-resolution **ChromBPNet / DeepLIFT** $\lvert\Delta\log_2\text{ATAC}\rvert$ footprints, and **MaxEntScan** splice-junction $\Delta\text{PSI}$ modeling across ClinVar, gnomAD v4 & ENCODE v4 cCREs (**0.941 AUROC**). |
| **[`aazminu/bayes-kalman-trace`](https://github.com/aazminu/bayes-kalman-trace)** | Recursive Bayesian State-Space Inference | Constant-acceleration **Kalman Filter** + **Rauch–Tung–Striebel (RTS)** smoother across **500-sample** noisy velocity trajectories with analytic missing-data marginalization and **log-linear pooling** over 250K measurements (**93.8% accuracy, 0.041 ECE**). |
| **[`aazminu/fold-energetics-xtb`](https://github.com/aazminu/fold-energetics-xtb)** | Structural Pocket Partitioning & QM Triage | **AlphaFold 3** `pLDDT` filtration and **PAE** spectral domain partitioning, **Foldseek 3Di** structural homology search, and semiempirical tight-binding quantum mechanics (**GFN2-xTB**) coupled with **ChEMBL (`pChEMBL`)** bioactivity priors. |

---

### II. Production Full-Stack, Data Operations & Open-Source Platforms (`github.com/aazminu`)

| Repository | Role & Scope | Technical Highlights & Verification |
| :--- | :--- | :--- |
| **[`aazminu/airtight-container`](https://github.com/aazminu/airtight-container)** | Full-Stack Yard Inventory & Billing Platform | **React 18, TypeScript, Node.js/Express, PostgreSQL, AWS EC2 (40K+ LOC, 25 migrations, 275+ automated tests)**. Implements idempotent month-end storage-and-handling proration (`buildLinesForBox`, `generateShMonthEnd`) with composite transactional locks across 240+ yard assets. |
| **[`aazminu/LeadAI`](https://github.com/aazminu/LeadAI)** | Async Entity Enrichment & Qualification Queue | **Python, FastAPI, Bounded Async Queue (`pipeline_queue.py`), PostgreSQL**. Multi-source company research, rate-limited token buckets, exponential-backoff retry recovery, and schema-validated structured LLM extraction. |
| **[`aazminu/odyssey`](https://github.com/aazminu/odyssey)** | University Learning Platform (Next.js / Strapi) | Repaired recursive AST block conversion so deeply indented MDX lesson paragraphs and headings render accurately in live author previews; eliminated embedded code-editor reload flicker; shipped multilevel **Jest** regression suites. |
| **[`aazminu/mermaid`](https://github.com/aazminu/mermaid)** | Declarative Diagramming & Charting Engine | Engineered configurable inner/outer data-value labels for SVG bar charts across horizontal and vertical orientations and refined journey-diagram text formatting with **Vitest & Cypress** visual regression coverage. |
| **[`aazminu/FarmData2`](https://github.com/aazminu/FarmData2)** | Operational Recordkeeping Platform | Built transactional **Node.js / Vue.js / PostgreSQL** operational recordkeeping APIs, containerized **Docker** dev workflows, and deterministic **Cypress** end-to-end integration test suites. |

---

### III. Systems Architecture, Distributed Data & Applied ML Suite ([Full 28-System Catalog](https://github.com/aazminu/abdullahazmi.com/blob/main/PROFILE_PLAN.md))

- **[`aazminu/data-cleaning-hackumass` — ScrubData Distributed Tabular Cleaning Engine](https://github.com/aazminu/data-cleaning-hackumass):** Automated schema inference, composite key deduplication, MAD/Z-score/IQR anomaly isolation, and exception manifest generation over 100K+ row CSV/Parquet datasets (`Python`, `Node.js`, `PostgreSQL`, `Apache Spark / Databricks`, `AWS S3`).
- **[`aazminu/python-riscv-simulator` — Cycle-Accurate RISC-V (`RV32I`) 5-Stage Pipelined Simulator](https://github.com/aazminu/python-riscv-simulator):** Bit-accurate single-cycle and 5-stage pipelined (`IF, ID, EX, MEM, WB`) RV32I processor simulator in `Python/C` with `EX/MEM` and `MEM/WB` RAW hazard forwarding, load-use stall bubble injection, and golden-trace verification.
- **[`aazminu/dividend-capture-spark` — Market-Scale Dividend Capture & Streaming Alpha](https://github.com/aazminu/dividend-capture-spark):** Distributed `Spark / HDFS` backtesting over 165K+ historical dividend declarations and 5 years of US equity bars paired with SPY-adjusted drop ratios, k-NN sector imputation, and temporal-split GBDT classifiers.
- **[`aazminu/world-model-compression-mpc` — Low-Rank SVD World-Model Compression (`LeWM`)](https://github.com/aazminu/world-model-compression-mpc):** Post-training uniform and activation-aware SVD (ASVD) spectral truncation and Hybrid Forward-KL + Elite-Classification distillation of latent world models for Cross-Entropy Method (CEM) Model Predictive Control on `TwoRoom` and `PushT` (**>96% planning reward at 45% compression, 1.72× rollout speedup**).
- **[`aazminu/adaptive-ml-moderation` — Adaptive Real-Time ML Moderation & Drift Engine](https://github.com/aazminu/adaptive-ml-moderation):** Sub-150ms p95 streaming toxicity inference combining hybrid word/char TF-IDF cascades and transformer scoring over 160K+ labeled records with leakage-safe splitting, priority triage queues, and Population Stability Index (PSI) drift monitoring.
- **[`aazminu/agentic-scrape-repair` — Agentic Scrape-Repair & Multi-Service ChatOps Bot](https://github.com/aazminu/agentic-scrape-repair):** Self-healing DOM selector repair engine gated on live schema verification paired with idempotent `Python / FastAPI / Slack`-to-`ServiceNow / Rally / GitHub` change synchronization (**95% reduction in manual triage latency**).
- **[`aazminu/movie-recc` — Real-Time WebSocket Group Recommender & Matrix Factorization](https://github.com/aazminu/movie-recc):** Multi-user `PyTorch` collaborative filtering and residual bias-corrected group utility aggregation streaming live consensus rankings across concurrent `FastAPI WebSocket` rooms (`<200ms` latency).

### IV. Additional Applied ML & Full-Stack Open-Source Repositories (`github.com/aazminu`)

- **[`aazminu/sp500_platform`](https://github.com/aazminu/sp500_platform):** S&P 500 portfolio risk analytics (Sharpe, Sortino, max drawdown), capped water-filling LLM conviction weight blending, and sell-first Alpaca rebalancing.
- **[`aazminu/AP-Study-Guide-Generator`](https://github.com/aazminu/AP-Study-Guide-Generator):** Automated AP curriculum scraper and sliding-window RAG study guide generator with Recall@K, MRR, and nDCG@K retrieval evaluation.
- **[`aazminu/Environmental-Disaster-Classifier`](https://github.com/aazminu/Environmental-Disaster-Classifier):** 10-year NASA EONET environmental disaster classification pipeline using 3D unit-sphere geospatial projection and inverse-frequency weighted k-NN.
- **[`aazminu/grab-pic`](https://github.com/aazminu/grab-pic):** Event photo sharing platform pairing a Spring Boot REST API with a GhostFaceNet + RetinaFace cosine-similarity selfie search worker.
- **[`aazminu/comic-subscription`](https://github.com/aazminu/comic-subscription):** Marvel comic series tracker and automated chapter-delta email notification service.
- **[`aazminu/motorcycle-rideability-index`](https://github.com/aazminu/motorcycle-rideability-index):** Weather-driven motorcycle rideability scoring API and severe-weather risk classification service.
- **[`aazminu/markov-music`](https://github.com/aazminu/markov-music):** Variable-order Markov chain musical sequence generator with lower-order suffix backoff, additive Laplace smoothing, log-sum-exp temperature decoding, and harmonic consonance evaluation.
- **[`aazminu/NYC-Property-Scout`](https://github.com/aazminu/NYC-Property-Scout):** NYC real-estate geospatial BBL normalization, multi-source dataset discrepancy auditing, spatial Haversine comparable matching, and NOI/cap-rate valuation pipeline.
- **[`aazminu/nitro-lab`](https://github.com/aazminu/nitro-lab):** Real-time Linux home-server and multi-container Docker health telemetry engine over Server-Sent Events (SSE) with online Welford/EWMA anomaly detection and SLA burn-rate calculation.
- **[`aazminu/Watch-Engine`](https://github.com/aazminu/Watch-Engine):** Hybrid Okapi BM25 and dense vector watch catalog search engine with Reciprocal Rank Fusion (RRF), MAD z-score price anomaly detection, and Recall@K/MRR/nDCG@K retrieval evaluation.
- **[`aazminu/ClaimLess`](https://github.com/aazminu/ClaimLess):** AI medical-bill auditing and patient advocacy engine with GPCI locality-adjusted CMS Medicare fee-schedule benchmarking, NCCI unbundling detection, and settlement strategy synthesis.
- **[`aazminu/finsim`](https://github.com/aazminu/finsim):** Interactive historical market regime and portfolio simulator with CAGR/Sharpe/Sortino/VaR/CVaR risk analytics, cash-conserving SELL-first rebalancing, and seeded GBM Monte Carlo projections.

---

### V. Verified Upstream Open-Source Pull Requests Merged (`author:aazminu`)

| Upstream Pull Request | Project & Stack | Technical Resolution & Verification |
| :--- | :--- | :--- |
| **[`exmergo/dex#634`](https://github.com/exmergo/dex/pull/634)** | **Dex Analytics Engineering Toolkit** (`Python`, `dbt`) | Resolved target node kinds via `self.index.node_kind(name)` inside `_Builder._matches` (`transform/propagate.py`) and checked all `_FILE_NODES` in `_refuse_surviving_reads` so `transform rename seed` and `transform rename snapshot` rewrite downstream `ref()` call sites and YAML node references atomically (`+81/−1`, `pytest` suite). |
| **[`exmergo/dex#633`](https://github.com/exmergo/dex/pull/633)** | **Dex Analytics Engineering Toolkit** (`Python`, `dbt`) | Updated `_GENERIC_HEADER` in `_collect_messages` (`transform/build.py`) to accept optional leading `[LEVEL]: ` tags in `dbt-core` 1.12 JSON log headers so underlying error causes remain attached during `shadow_parse` and `build` (`+50/−1`, `pytest` suite). |
| **[`GustavoBaranda/chatflow-agent#52`](https://github.com/GustavoBaranda/chatflow-agent/pull/52)** | **ChatFlow Async Multi-Agent Runtime** (`Python`, `SQLite`, `AsyncIO`) | Checkpointed and restored `session.active_agent` and deep-copied `session.metadata` across both in-memory `SessionContext` and persistent `SQLiteSessionContext` (`chatflow_sessions`) when an unhandled exception triggers a turn rollback in `Runner.run_async()` (`+225/−7`, 190 `pytest` tests passing). |
| **[`repowise-dev/repowise#3841`](https://github.com/repowise-dev/repowise/pull/3841)** | **Repowise Codebase Intelligence & MCP Graph** (`Python`, `AST`) | Extended `_BUILD_NAME_RE` (`code_origin.py`) to classify version-specific Swift Package Manager manifests (`Package@swift-<version>.swift`) as `build` files without misclassifying ordinary Swift sources, eliminating false-positive dead-code findings (`+66/−1`, `pytest` unit & dead-code suites). |

---

### Technical Stack

**Languages & Systems:**  
![Python](https://img.shields.io/badge/-Python_3.11+-000?&logo=python)
![TypeScript](https://img.shields.io/badge/-TypeScript-000?&logo=typescript)
![SQL](https://img.shields.io/badge/-PostgreSQL_%2F_SQL-000?&logo=postgresql)
![C++](https://img.shields.io/badge/-C_%2F_C++-000?&logo=cplusplus)
![Rust](https://img.shields.io/badge/-Rust-000?&logo=rust)
![RISC-V](https://img.shields.io/badge/-RISC--V_RV32I-000?&logo=riscv)

**AI, Bioinformatics, Web & Data Infrastructure:**  
![PyTorch](https://img.shields.io/badge/-PyTorch-000?&logo=pytorch)
![FastAPI](https://img.shields.io/badge/-FastAPI-000?&logo=fastapi)
![React](https://img.shields.io/badge/-React_18_%2F_Next.js_14-000?&logo=react)
![Node.js](https://img.shields.io/badge/-Node.js_%2F_Express-000?&logo=nodedotjs)
![PostgreSQL](https://img.shields.io/badge/-pgvector-000?&logo=postgresql)
![Neo4j](https://img.shields.io/badge/-Neo4j-000?&logo=neo4j)
![Apache Spark](https://img.shields.io/badge/-Spark_%2F_Kafka-000?&logo=apachespark)
![Docker](https://img.shields.io/badge/-Docker_%2F_AWS-000?&logo=docker)

---

### Contact & Verification
- **Main Portfolio & Interactive Workbench:** [https://abdullahazmi.com/](https://abdullahazmi.com/)
- **CGAS Lab Portal:** [https://abdullahazmi.com/lab/](https://abdullahazmi.com/lab/)
- **Academic Email:** [m4u5t4@u.northwestern.edu](mailto:m4u5t4@u.northwestern.edu) · **Direct:** [erlokix@gmail.com](mailto:erlokix@gmail.com)
- **ORCID:** [0009-0004-8172-6394](https://orcid.org/0009-0004-8172-6394)

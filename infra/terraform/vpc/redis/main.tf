resource "aws_elasticache_cluster" "redis_cluster" {
  cluster_id = "sw-redis-cluster"
  subnet_group_name = aws_elasticache_subnet_group.redis_subnet_group.name
  tags = var.tags
  num_cache_nodes = 1
  node_type = "cache.t2.micro"
  engine = "redis"
  engine_version = "5.0.5"
  security_group_ids = [
    aws_security_group.redis_security_group.id]
}

resource "aws_elasticache_subnet_group" "redis_subnet_group" {
  name = "sw-redis-subnet-group"
  description = "ElasticCache subnet group"
  subnet_ids = var.private_subnet_ids
}

resource "aws_security_group" "redis_security_group" {
  name = "sw-redis-security-group"
  ingress {
    from_port = 6379
    protocol = "TCP"
    to_port = 6379
    security_groups = [
      var.nat_security_group_id]
  }
  tags = var.tags
  vpc_id = var.vpc_id
}
